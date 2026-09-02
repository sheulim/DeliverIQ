import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammeValue({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme)return <main style={{padding:32}}>Programme not found.</main>;

  const {data:projects=[]}=await sb.from("projects").select("id,name").eq("programme_id",id);
  const ids=projects.map((p:any)=>p.id);
  const [{data:benefits=[]},{data:okrs=[]}]=ids.length?await Promise.all([
    sb.from("benefits").select("*").in("project_id",ids),
    sb.from("okrs").select("*").in("project_id",ids)
  ]):[{data:[]},{data:[]}];

  const names=Object.fromEntries(projects.map((p:any)=>[p.id,p.name]));

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/programmes/"+id}>← Programme</Link>
    <h1>Programme Value Realisation</h1>
    <p style={{color:"#667085"}}>{programme.name} · Benefits and OKRs across all programme projects</p>

    <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18,marginBottom:18}}>
      <h2>Benefits</h2>
      {benefits.length===0?<p>No benefits found.</p>:benefits.map((b:any)=><div key={b.id} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr .8fr .8fr",gap:10,padding:"11px 0",borderBottom:"1px solid #eee"}}>
        <b>{b.title}</b><span>{names[b.project_id]}</span><span>{b.actual_value??"—"} {b.unit||""}</span><span>{b.status}</span>
      </div>)}
    </section>

    <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}>
      <h2>OKRs</h2>
      {okrs.length===0?<p>No OKRs found.</p>:okrs.map((o:any)=><div key={o.id} style={{padding:"11px 0",borderBottom:"1px solid #eee"}}>
        <b>{o.objective}</b> — {o.key_result} — {names[o.project_id]} — {o.actual_value??"—"}/{o.target_value??"—"} {o.unit||""}
      </div>)}
    </section>
  </main>;
}
