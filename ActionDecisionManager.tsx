'use client';
import {useMemo,useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function ActionDecisionManager({project,initialActions,initialDecisions}:{project:any,initialActions:any[],initialDecisions:any[]}){
  const [tab,setTab]=useState<"actions"|"decisions">("actions");
  const [actions,setActions]=useState(initialActions);
  const [decisions,setDecisions]=useState(initialDecisions);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [review,setReview]=useState<any>(null);

  const [a,setA]=useState({title:"",owner:"",due_date:"",priority:"medium",description:""});
  const [d,setD]=useState({title:"",owner_or_forum:"",due_date:"",context:"",impact:""});

  const now=new Date();
  const open=(s:string)=>!["closed","completed","done","resolved"].includes(String(s||"").toLowerCase());

  const metrics=useMemo(()=>({
    open:actions.filter(x=>open(x.status)).length,
    overdue:actions.filter(x=>open(x.status)&&x.due_date&&new Date(x.due_date)<now).length,
    dueSoon:actions.filter(x=>{
      if(!open(x.status)||!x.due_date)return false;
      const diff=(new Date(x.due_date).getTime()-now.getTime())/(1000*60*60*24);
      return diff>=0&&diff<=7;
    }).length,
    pendingDecisions:decisions.filter(x=>!["made","approved","closed","rejected"].includes(String(x.status||"").toLowerCase())).length
  }),[actions,decisions]);

  async function addAction(){
    if(!a.title.trim())return;
    const {data,error}=await supabase.from("actions").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      title:a.title,owner:a.owner||null,due_date:a.due_date||null,
      priority:a.priority,description:a.description||null,status:"open"
    }).select().single();
    if(error)return setMessage(error.message);
    setActions([data,...actions]);
    setA({title:"",owner:"",due_date:"",priority:"medium",description:""});
  }

  async function completeAction(id:string){
    const {data,error}=await supabase.from("actions").update({status:"completed",completed_at:new Date().toISOString()}).eq("id",id).select().single();
    if(error)return setMessage(error.message);
    setActions(actions.map(x=>x.id===id?data:x));
  }

  async function addDecision(){
    if(!d.title.trim())return;
    const {data,error}=await supabase.from("decisions").insert({
      project_id:project.id,programme_id:project.programme_id||null,title:d.title,
      owner_or_forum:d.owner_or_forum||null,due_date:d.due_date||null,
      context:d.context||null,impact:d.impact||null,status:"pending"
    }).select().single();
    if(error)return setMessage(error.message);
    setDecisions([data,...decisions]);
    setD({title:"",owner_or_forum:"",due_date:"",context:"",impact:""});
  }

  async function markDecision(id:string){
    const decisionText=prompt("Enter the decision taken:");
    if(!decisionText)return;
    const rationale=prompt("Rationale (optional):")||null;
    const {data,error}=await supabase.from("decisions").update({
      status:"made",decision:decisionText,rationale,decision_date:new Date().toISOString().slice(0,10)
    }).eq("id",id).select().single();
    if(error)return setMessage(error.message);
    setDecisions(decisions.map(x=>x.id===id?data:x));
  }

  async function aiReview(){
    setLoading(true);setMessage("");setReview(null);
    try{
      const r=await fetch("/api/ai/commitment-review",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({projectId:project.id})
      });
      const data=await r.json();
      if(!r.ok)throw Error(data.error||"Review failed.");
      setReview(data);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  return <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,margin:"20px 0"}}>
      <div style={card}><small>Open actions</small><div style={{fontSize:30,fontWeight:850}}>{metrics.open}</div></div>
      <div style={card}><small>Overdue</small><div style={{fontSize:30,fontWeight:850}}>{metrics.overdue}</div></div>
      <div style={card}><small>Due next 7 days</small><div style={{fontSize:30,fontWeight:850}}>{metrics.dueSoon}</div></div>
      <div style={card}><small>Pending decisions</small><div style={{fontSize:30,fontWeight:850}}>{metrics.pendingDecisions}</div></div>
    </div>

    <div style={{...card,background:"linear-gradient(135deg,#f4f1ff,#fff)",marginBottom:18}}>
      <h2 style={{marginTop:0}}>Commitment Review</h2>
      <p style={{color:"#667085"}}>Ask DeliverIQ which commitments are slipping and where intervention is needed.</p>
      <button onClick={aiReview} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading?"Reviewing commitments…":"What commitments are slipping? ✨"}
      </button>
      {message&&<p>{message}</p>}
    </div>

    {review&&<section style={{...card,marginBottom:18}}>
      <h2>{review.headline}</h2>
      <p>{review.executive_summary}</p>
      <h3>Commitments needing attention</h3>
      {(review.commitments_needing_attention||[]).map((x:any,i:number)=>
        <div key={i} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.title}</b> — {x.reason}
          <div><small>Owner: {x.owner||"Not assigned"} · Action: {x.recommended_action}</small></div>
        </div>
      )}
      <h3>Decisions blocking progress</h3>
      <ul>{(review.decisions_blocking_progress||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      <h3>Recommended interventions</h3>
      <ol>{(review.recommended_interventions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>
    </section>}

    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>setTab("actions")} style={{fontWeight:tab==="actions"?"bold":"normal"}}>Actions</button>
      <button onClick={()=>setTab("decisions")} style={{fontWeight:tab==="decisions"?"bold":"normal"}}>Decisions</button>
    </div>

    {tab==="actions"?<section style={card}>
      <h2>Action Register</h2>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
        <input placeholder="Action title" value={a.title} onChange={e=>setA({...a,title:e.target.value})}/>
        <input placeholder="Owner" value={a.owner} onChange={e=>setA({...a,owner:e.target.value})}/>
        <input type="date" value={a.due_date} onChange={e=>setA({...a,due_date:e.target.value})}/>
        <select value={a.priority} onChange={e=>setA({...a,priority:e.target.value})}>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
        </select>
      </div>
      <textarea placeholder="Description" value={a.description} onChange={e=>setA({...a,description:e.target.value})} style={{width:"100%",minHeight:70}}/>
      <button onClick={addAction} style={{marginTop:8}}>Add Action</button>

      {actions.map(x=>{
        const overdue=open(x.status)&&x.due_date&&new Date(x.due_date)<now;
        return <div key={x.id} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.title}</b> {overdue&&<span style={{color:"#b42318"}}> · OVERDUE</span>}
          <div style={{color:"#667085"}}>{x.owner||"Unassigned"} · {x.due_date||"No due date"} · {x.priority} · {x.status}</div>
          {open(x.status)&&<button onClick={()=>completeAction(x.id)} style={{marginTop:6}}>Mark complete</button>}
        </div>
      })}
    </section>:<section style={card}>
      <h2>Decision Register</h2>
      <input placeholder="Decision needed" value={d.title} onChange={e=>setD({...d,title:e.target.value})} style={{width:"100%",padding:9,marginBottom:8}}/>
      <input placeholder="Owner / forum" value={d.owner_or_forum} onChange={e=>setD({...d,owner_or_forum:e.target.value})} style={{width:"100%",padding:9,marginBottom:8}}/>
      <input type="date" value={d.due_date} onChange={e=>setD({...d,due_date:e.target.value})} style={{padding:9,marginBottom:8}}/>
      <textarea placeholder="Context" value={d.context} onChange={e=>setD({...d,context:e.target.value})} style={{width:"100%",minHeight:70,display:"block",marginBottom:8}}/>
      <textarea placeholder="Impact if delayed" value={d.impact} onChange={e=>setD({...d,impact:e.target.value})} style={{width:"100%",minHeight:70,display:"block"}}/>
      <button onClick={addDecision} style={{marginTop:8}}>Add Decision</button>

      {decisions.map(x=><div key={x.id} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
        <b>{x.title}</b>
        <div style={{color:"#667085"}}>{x.owner_or_forum||"No forum"} · {x.due_date||"No due date"} · {x.status}</div>
        {x.decision&&<div style={{marginTop:5}}>Decision: {x.decision}</div>}
        {x.status==="pending"&&<button onClick={()=>markDecision(x.id)} style={{marginTop:6}}>Record decision</button>}
      </div>)}
    </section>}
  </>;
}
