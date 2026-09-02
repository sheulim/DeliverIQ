import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import ActionDecisionManager from "@/components/ActionDecisionManager";

export default async function ActionsPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project) return <main style={{padding:32}}>Project not found.</main>;

  const [{data:actions=[]},{data:decisions=[]}]=await Promise.all([
    sb.from("actions").select("*").eq("project_id",id).order("created_at",{ascending:false}),
    sb.from("decisions").select("*").eq("project_id",id).order("created_at",{ascending:false})
  ]);

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Action & Decision Intelligence</h1>
    <p style={{color:"#667085"}}>{project.name} · Track commitments, ownership and decisions.</p>
    <ActionDecisionManager project={project} initialActions={actions} initialDecisions={decisions}/>
  </main>;
}
