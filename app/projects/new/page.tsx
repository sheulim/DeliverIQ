'use client';
import {useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function NewProject() {
  const [description,setDescription]=useState("");
  const [result,setResult]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function analyse() {
    setLoading(true);setError("");
    try {
      const r=await fetch("/api/ai/project",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description,answers:{},mode:"blueprint"})});
      const d=await r.json();
      if(!r.ok) throw Error(d.error||"AI request failed");
      setResult(d);
    } catch(e:any){setError(e.message)} finally{setLoading(false)}
  }

  async function save() {
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return setError("Please sign in.");
    const {data:p,error}=await supabase.from("projects").insert({
      user_id:user.id,name:result.project.name,description:description,
      project_type:result.project.project_type,methodology:result.project.methodology,health:"green"
    }).select().single();
    if(error)return setError(error.message);
    if(result.raid_items?.length) await supabase.from("raid_items").insert(result.raid_items.map((x:any)=>({
      project_id:p.id,item_type:x.item_type,title:x.title,description:x.description,
      owner:x.owner_role,probability:x.probability,impact:x.impact,status:"open",mitigation:x.mitigation
    })));
    if(result.milestones?.length) await supabase.from("milestones").insert(result.milestones.map((x:any)=>({
      project_id:p.id,name:x.name,status:x.status
    })));
    if(result.dependencies?.length) await supabase.from("dependencies").insert(result.dependencies.map((x:any)=>({
      project_id:p.id,title:x.title,provider:x.provider,consumer:x.consumer,impact:x.impact,status:"open"
    })));
    location.href="/projects/"+p.id;
  }

  return <main style={{maxWidth:900,margin:"40px auto",padding:20}}>
    <h1>Create Project with AI</h1>
    <p>Describe your project naturally. DeliverIQ turns it into a delivery blueprint.</p>
    <textarea value={description} onChange={e=>setDescription(e.target.value)}
      placeholder="Example: We are migrating Teradata to Snowflake in 9 months. Four teams are involved and parallel reconciliation is required before go-live."
      style={{width:"100%",minHeight:220,padding:14}} />
    {error&&<p>{error}</p>}
    <button onClick={analyse} disabled={!description||loading}>{loading?"Analysing…":"Generate Delivery Blueprint"}</button>
    {result&&<section style={{marginTop:25}}>
      <h2>{result.project.name}</h2>
      <p>{result.project.project_type} · {result.project.methodology} · {result.project.duration}</p>
      <h3>Objectives</h3><ul>{result.project.objectives.map((x:string)=><li key={x}>{x}</li>)}</ul>
      <h3>Milestones</h3><ul>{result.milestones.map((x:any)=><li key={x.name}>{x.name} — {x.target_hint}</li>)}</ul>
      <h3>Initial RAID</h3><ul>{result.raid_items.map((x:any)=><li key={x.title}>{x.item_type.toUpperCase()} — {x.title}</li>)}</ul>
      <h3>Dependencies</h3><ul>{result.dependencies.map((x:any)=><li key={x.title}>{x.title}</li>)}</ul>
      <button onClick={save}>Approve & Save Project</button>
    </section>}
  </main>;
}
