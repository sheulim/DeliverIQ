'use client';
import {useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function ChangeIntelligence({project,initialChanges,initialRequirements}:{project:any,initialChanges:any[],initialRequirements:any[]}){
  const [changes,setChanges]=useState(initialChanges); const [reqs,setReqs]=useState(initialRequirements);
  const [review,setReview]=useState<any>(null); const [loading,setLoading]=useState(false); const [msg,setMsg]=useState("");
  const [c,setC]=useState({title:"",description:"",reason:"",requested_by:"",owner:"",priority:"medium"});
  const [r,setR]=useState({title:"",description:"",requirement_type:"business",priority:"medium",owner:"",acceptance_criteria:""});
  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  async function addReq(){if(!r.title)return; const {data,error}=await supabase.from("requirements").insert({project_id:project.id,programme_id:project.programme_id||null,...r}).select().single(); if(error)return setMsg(error.message);setReqs([data,...reqs]);setR({title:"",description:"",requirement_type:"business",priority:"medium",owner:"",acceptance_criteria:""})}
  async function addChange(){if(!c.title)return; const {data,error}=await supabase.from("change_requests").insert({project_id:project.id,programme_id:project.programme_id||null,...c,status:"proposed"}).select().single(); if(error)return setMsg(error.message);setChanges([data,...changes]);setC({title:"",description:"",reason:"",requested_by:"",owner:"",priority:"medium"})}
  async function assess(id:string){setLoading(true);setReview(null);const res=await fetch("/api/ai/change-impact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({projectId:project.id,changeId:id})});const d=await res.json();setLoading(false);if(!res.ok)return setMsg(d.error||"Failed");setReview(d)}

  return <div style={{display:"grid",gap:18}}>
    <section style={card}><h2>Change Register</h2>
      <input placeholder="Change title" value={c.title} onChange={e=>setC({...c,title:e.target.value})} style={{width:"100%",padding:9}}/>
      <textarea placeholder="Description" value={c.description} onChange={e=>setC({...c,description:e.target.value})} style={{width:"100%",minHeight:70,marginTop:8}}/>
      <input placeholder="Reason" value={c.reason} onChange={e=>setC({...c,reason:e.target.value})} style={{width:"100%",padding:9,marginTop:8}}/>
      <button onClick={addChange} style={{marginTop:8}}>Add Change</button>
      {changes.map((x:any)=><div key={x.id} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}><b>{x.title}</b> · {x.status}<br/><small>{x.reason}</small><br/><button onClick={()=>assess(x.id)} disabled={loading}>Assess impact ✨</button></div>)}
    </section>
    {review&&<section style={card}><h2>{review.headline}</h2><p><b>Recommendation:</b> {review.recommendation}</p><h3>Schedule</h3><p>{review.schedule_impact?.known||review.schedule_impact?.pressure}</p><h3>Cost</h3><p>{review.cost_impact?.known||review.cost_impact?.pressure}</p><h3>Capacity</h3><p>{review.capacity_impact?.known||review.capacity_impact?.pressure}</p><h3>Actions</h3><ul>{(review.recommended_actions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul><small>{review.confidence_note}</small></section>}
    <section style={card}><h2>Requirements Traceability</h2>
      <input placeholder="Requirement title" value={r.title} onChange={e=>setR({...r,title:e.target.value})} style={{width:"100%",padding:9}}/>
      <textarea placeholder="Acceptance criteria" value={r.acceptance_criteria} onChange={e=>setR({...r,acceptance_criteria:e.target.value})} style={{width:"100%",minHeight:70,marginTop:8}}/>
      <button onClick={addReq} style={{marginTop:8}}>Add Requirement</button>
      {reqs.map((x:any)=><div key={x.id} style={{padding:"10px 0",borderBottom:"1px solid #eee"}}><b>{x.title}</b> · {x.priority} · {x.status}</div>)}
    </section>
    {msg&&<p>{msg}</p>}
  </div>
}
