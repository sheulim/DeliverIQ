'use client';
import {useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function ProgrammeProjectManager({programmeId,projects,unassigned}:{programmeId:string,projects:any[],unassigned:any[]}){
  const [selected,setSelected]=useState("");
  const [message,setMessage]=useState("");

  async function assign(){
    if(!selected) return;
    const {error}=await supabase.from("projects").update({programme_id:programmeId}).eq("id",selected);
    if(error) setMessage(error.message);
    else location.reload();
  }

  async function remove(projectId:string){
    const {error}=await supabase.from("projects").update({programme_id:null}).eq("id",projectId);
    if(error) setMessage(error.message);
    else location.reload();
  }

  return <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18,margin:"20px 0"}}>
    <h2>Programme Projects</h2>
    {projects.length===0?<p>No projects assigned yet.</p>:
      projects.map(p=>
        <div key={p.id} style={{padding:"10px 0",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between"}}>
          <span><b>{p.name}</b> · {(p.health||"green").toUpperCase()}</span>
          <button onClick={()=>remove(p.id)}>Remove</button>
        </div>
      )
    }
    <div style={{marginTop:16}}>
      <select value={selected} onChange={e=>setSelected(e.target.value)} style={{padding:9,minWidth:260}}>
        <option value="">Assign an unassigned project…</option>
        {unassigned.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button onClick={assign} style={{marginLeft:8}}>Assign</button>
    </div>
    {message&&<p>{message}</p>}
  </section>;
}
