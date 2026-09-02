'use client';
import {useMemo,useState} from "react";
import {supabase} from "@/lib/supabase/browser";

function pct(b:any,t:any,a:any){
  const baseline=Number(b),target=Number(t),actual=Number(a);
  if([baseline,target,actual].some(Number.isNaN)||target===baseline)return null;
  return Math.max(0,Math.min(100,Math.round(((actual-baseline)/(target-baseline))*100)));
}

export default function ValueRealisationManager({project,initialBenefits,initialOkrs,reviews}:{project:any,initialBenefits:any[],initialOkrs:any[],reviews:any[]}){
  const [tab,setTab]=useState<"benefits"|"okrs">("benefits");
  const [benefits,setBenefits]=useState(initialBenefits);
  const [okrs,setOkrs]=useState(initialOkrs);
  const [review,setReview]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  const [b,setB]=useState({title:"",description:"",benefit_type:"financial",owner:"",baseline_value:"",target_value:"",actual_value:"",unit:"",target_date:"",status:"planned",confidence:"medium",evidence:""});
  const [o,setO]=useState({objective:"",key_result:"",owner:"",baseline_value:"",target_value:"",actual_value:"",unit:"",target_date:"",status:"on_track"});

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  const measured=useMemo(()=>{
    const vals=[...benefits.map(x=>pct(x.baseline_value,x.target_value,x.actual_value)),...okrs.map(x=>pct(x.baseline_value,x.target_value,x.actual_value))].filter(x=>x!==null) as number[];
    return vals.length?Math.round(vals.reduce((a,c)=>a+c,0)/vals.length):null;
  },[benefits,okrs]);

  async function addBenefit(){
    if(!b.title.trim())return;
    const {data,error}=await supabase.from("benefits").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      ...b,
      baseline_value:b.baseline_value===""?null:Number(b.baseline_value),
      target_value:b.target_value===""?null:Number(b.target_value),
      actual_value:b.actual_value===""?null:Number(b.actual_value),
      target_date:b.target_date||null
    }).select().single();
    if(error)return setMessage(error.message);
    setBenefits([data,...benefits]);
    setB({title:"",description:"",benefit_type:"financial",owner:"",baseline_value:"",target_value:"",actual_value:"",unit:"",target_date:"",status:"planned",confidence:"medium",evidence:""});
  }

  async function addOkr(){
    if(!o.objective.trim()||!o.key_result.trim())return;
    const {data,error}=await supabase.from("okrs").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      ...o,
      baseline_value:o.baseline_value===""?null:Number(o.baseline_value),
      target_value:o.target_value===""?null:Number(o.target_value),
      actual_value:o.actual_value===""?null:Number(o.actual_value),
      target_date:o.target_date||null
    }).select().single();
    if(error)return setMessage(error.message);
    setOkrs([data,...okrs]);
    setO({objective:"",key_result:"",owner:"",baseline_value:"",target_value:"",actual_value:"",unit:"",target_date:"",status:"on_track"});
  }

  async function aiReview(){
    setLoading(true);setMessage("");setReview(null);
    try{
      const r=await fetch("/api/ai/value-review",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({projectId:project.id})
      });
      const d=await r.json();
      if(!r.ok)throw Error(d.error||"Review failed.");
      setReview(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  return <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,margin:"20px 0"}}>
      <div style={card}><small>Benefits</small><div style={{fontSize:30,fontWeight:850}}>{benefits.length}</div></div>
      <div style={card}><small>OKRs</small><div style={{fontSize:30,fontWeight:850}}>{okrs.length}</div></div>
      <div style={card}><small>Measured value score</small><div style={{fontSize:30,fontWeight:850}}>{measured===null?"—":measured+"%"}</div></div>
      <div style={card}><small>Previous reviews</small><div style={{fontSize:30,fontWeight:850}}>{reviews.length}</div></div>
    </div>

    <section style={{...card,background:"linear-gradient(135deg,#f4f1ff,#fff)",marginBottom:18}}>
      <h2 style={{marginTop:0}}>Value Realisation Intelligence</h2>
      <p style={{color:"#667085"}}>Ask DeliverIQ whether the project is delivering intended outcomes, not just completing work.</p>
      <button onClick={aiReview} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading?"Reviewing value…":"Are we delivering the intended business value? ✨"}
      </button>
      {message&&<p>{message}</p>}
    </section>

    {review&&<section style={{...card,marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:14}}>
        <div>
          <h2>{review.review.headline}</h2>
          <p>{review.review.executive_summary}</p>
        </div>
        <div style={{textAlign:"right"}}>
          <b style={{fontSize:22}}>{review.review.value_health}</b><br/>
          <span>{review.review.value_score ?? review.deterministic_value_score ?? "—"}{(review.review.value_score??review.deterministic_value_score)!==null?"%":""}</span>
        </div>
      </div>
      <h3>Benefits at risk</h3>
      {(review.review.benefits_at_risk||[]).map((x:any,i:number)=><div key={i} style={{padding:"9px 0",borderBottom:"1px solid #eee"}}>
        <b>{x.benefit}</b> — {x.reason}<div><small>Action: {x.recommended_action}</small></div>
      </div>)}
      <h3>Delivery vs value gaps</h3>
      <ul>{(review.review.delivery_vs_value_gap||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      <h3>Recommended actions</h3>
      <ol>{(review.review.recommended_actions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>
      <small>{review.review.confidence_note}</small>
    </section>}

    <div style={{display:"flex",gap:8,marginBottom:12}}>
      <button onClick={()=>setTab("benefits")} style={{fontWeight:tab==="benefits"?"bold":"normal"}}>Benefits</button>
      <button onClick={()=>setTab("okrs")} style={{fontWeight:tab==="okrs"?"bold":"normal"}}>OKRs</button>
    </div>

    {tab==="benefits"?<section style={card}>
      <h2>Benefits Register</h2>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
        <input placeholder="Benefit title" value={b.title} onChange={e=>setB({...b,title:e.target.value})}/>
        <select value={b.benefit_type} onChange={e=>setB({...b,benefit_type:e.target.value})}>
          <option value="financial">Financial</option><option value="customer">Customer</option><option value="operational">Operational</option><option value="risk">Risk reduction</option><option value="compliance">Compliance</option>
        </select>
        <input placeholder="Owner" value={b.owner} onChange={e=>setB({...b,owner:e.target.value})}/>
        <input type="date" value={b.target_date} onChange={e=>setB({...b,target_date:e.target.value})}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:8}}>
        <input placeholder="Baseline" value={b.baseline_value} onChange={e=>setB({...b,baseline_value:e.target.value})}/>
        <input placeholder="Target" value={b.target_value} onChange={e=>setB({...b,target_value:e.target.value})}/>
        <input placeholder="Actual" value={b.actual_value} onChange={e=>setB({...b,actual_value:e.target.value})}/>
        <input placeholder="Unit (%, $, hrs…)" value={b.unit} onChange={e=>setB({...b,unit:e.target.value})}/>
      </div>
      <textarea placeholder="Description" value={b.description} onChange={e=>setB({...b,description:e.target.value})} style={{width:"100%",minHeight:70,marginTop:8}}/>
      <textarea placeholder="Evidence / measurement source" value={b.evidence} onChange={e=>setB({...b,evidence:e.target.value})} style={{width:"100%",minHeight:60,marginTop:8}}/>
      <button onClick={addBenefit} style={{marginTop:8}}>Add Benefit</button>

      {benefits.map(x=>{
        const p=pct(x.baseline_value,x.target_value,x.actual_value);
        return <div key={x.id} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.title}</b>
          <div style={{color:"#667085"}}>{x.owner||"Unassigned"} · Target {x.target_value??"—"} {x.unit||""} · Actual {x.actual_value??"—"} {x.unit||""} · {p===null?"No measurable progress":p+"% realised"}</div>
        </div>
      })}
    </section>:<section style={card}>
      <h2>OKRs</h2>
      <input placeholder="Objective" value={o.objective} onChange={e=>setO({...o,objective:e.target.value})} style={{width:"100%",padding:9,marginBottom:8}}/>
      <input placeholder="Key result" value={o.key_result} onChange={e=>setO({...o,key_result:e.target.value})} style={{width:"100%",padding:9,marginBottom:8}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
        <input placeholder="Owner" value={o.owner} onChange={e=>setO({...o,owner:e.target.value})}/>
        <input placeholder="Baseline" value={o.baseline_value} onChange={e=>setO({...o,baseline_value:e.target.value})}/>
        <input placeholder="Target" value={o.target_value} onChange={e=>setO({...o,target_value:e.target.value})}/>
        <input placeholder="Actual" value={o.actual_value} onChange={e=>setO({...o,actual_value:e.target.value})}/>
        <input placeholder="Unit" value={o.unit} onChange={e=>setO({...o,unit:e.target.value})}/>
      </div>
      <input type="date" value={o.target_date} onChange={e=>setO({...o,target_date:e.target.value})} style={{marginTop:8}}/>
      <button onClick={addOkr} style={{marginTop:8,marginLeft:8}}>Add OKR</button>

      {okrs.map(x=>{
        const p=pct(x.baseline_value,x.target_value,x.actual_value);
        return <div key={x.id} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.objective}</b>
          <div>{x.key_result}</div>
          <small>{x.owner||"Unassigned"} · {p===null?"No measurable progress":p+"% toward target"}</small>
        </div>
      })}
    </section>}
  </>;
}
