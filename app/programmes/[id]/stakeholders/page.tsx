import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammeStakeholders({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme)return <main style={{padding:32}}>Programme not found.</main>;

  const {data:projects=[]}=await sb.from("projects").select("id,name").eq("programme_id",id);
  const ids=projects.map((p:any)=>p.id);
  const {data:stakeholders=[]}=ids.length
    ? await sb.from("stakeholders").select("*").in("project_id",ids).order("created_at",{ascending:false})
    : {data:[]};

  const names=Object.fromEntries(projects.map((p:any)=>[p.id,p.name]));

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/programmes/"+id}>← Programme</Link>
    <h1>Programme Stakeholder Map</h1>
    <p style={{color:"#667085"}}>{programme.name} · Stakeholders across all programme projects</p>

    <div style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}>
      {stakeholders.length===0?<p>No stakeholders found.</p>:stakeholders.map((s:any)=>
        <div key={s.id} style={{display:"grid",gridTemplateColumns:"1.2fr 1.2fr .7fr .7fr .8fr",gap:10,padding:"11px 0",borderBottom:"1px solid #eee"}}>
          <b>{s.name}</b>
          <span>{names[s.project_id]||"Project"}</span>
          <span>{s.influence}</span>
          <span>{s.interest}</span>
          <span>{s.sentiment}</span>
        </div>
      )}
    </div>
  </main>;
}
