import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammeCommitments({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme)return <main style={{padding:32}}>Programme not found.</main>;

  const {data:projects=[]}=await sb.from("projects").select("id,name").eq("programme_id",id);
  const ids=projects.map((p:any)=>p.id);
  const [{data:actions=[]},{data:decisions=[]}]=ids.length?await Promise.all([
    sb.from("actions").select("*").in("project_id",ids).order("due_date",{ascending:true}),
    sb.from("decisions").select("*").in("project_id",ids).order("due_date",{ascending:true})
  ]):[{data:[]},{data:[]}];

  const names=Object.fromEntries(projects.map((p:any)=>[p.id,p.name]));

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/programmes/"+id}>← Programme</Link>
    <h1>Programme Commitments</h1>
    <p style={{color:"#667085"}}>{programme.name} · Cross-project actions and decisions</p>

    <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18,marginBottom:18}}>
      <h2>Actions</h2>
      {actions.map((a:any)=><div key={a.id} style={{padding:"10px 0",borderBottom:"1px solid #eee"}}>
        <b>{a.title}</b> — {names[a.project_id]} — {a.owner||"Unassigned"} — {a.due_date||"No due date"} — {a.status}
      </div>)}
    </section>

    <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}>
      <h2>Decisions</h2>
      {decisions.map((d:any)=><div key={d.id} style={{padding:"10px 0",borderBottom:"1px solid #eee"}}>
        <b>{d.title}</b> — {names[d.project_id]} — {d.owner_or_forum||"No forum"} — {d.status}
      </div>)}
    </section>
  </main>;
}
