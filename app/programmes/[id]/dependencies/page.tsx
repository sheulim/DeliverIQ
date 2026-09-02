import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammeDependencies({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();
  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme) return <main style={{padding:32}}>Programme not found.</main>;

  const {data:projects=[]}=await sb.from("projects").select("id,name,health").eq("programme_id",id);
  const ids=projects.map((p:any)=>p.id);
  const {data:dependencies=[]}=ids.length
    ? await sb.from("dependencies").select("*").in("project_id",ids)
    : {data:[]};

  const projectName=Object.fromEntries(projects.map((p:any)=>[p.id,p.name]));

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/programmes/"+id}>← Programme</Link>
    <h1>Programme Dependency Heatmap</h1>
    <p style={{color:"#667085"}}>{programme.name} · Cross-project dependency exposure</p>

    <div style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}>
      {dependencies.length===0?<p>No programme dependencies found.</p>:
        dependencies.map((d:any)=>
          <div key={d.id} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr .7fr",gap:12,padding:"12px 0",borderBottom:"1px solid #eee"}}>
            <b>{d.title}</b>
            <span>{projectName[d.project_id] || "Source project"}</span>
            <span>{projectName[d.downstream_project_id] || d.consumer || "Downstream not linked"}</span>
            <span>{String(d.status||"open").toUpperCase()}</span>
          </div>
        )
      }
    </div>
  </main>;
}
