import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import ChangeIntelligence from "@/components/ChangeIntelligence";

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const sb=await createClient();
  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project)return <main style={{padding:32}}>Project not found.</main>;
  const [{data:changes=[]},{data:reqs=[]}]=await Promise.all([
    sb.from("change_requests").select("*").eq("project_id",id).order("created_at",{ascending:false}),
    sb.from("requirements").select("*").eq("project_id",id).order("created_at",{ascending:false})
  ]);
  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Change, Scope & Requirements Intelligence</h1>
    <p style={{color:"#667085"}}>{project.name} · Control scope and understand change impact before approval.</p>
    <ChangeIntelligence project={project} initialChanges={changes} initialRequirements={reqs}/>
  </main>;
}
