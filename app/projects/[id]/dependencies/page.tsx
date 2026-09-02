import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import DependencyIntelligence from "@/components/DependencyIntelligence";

export default async function DependencyPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project) return <main style={{padding:32}}>Project not found.</main>;

  const {data:dependencies=[]}=await sb.from("dependencies").select("*").eq("project_id",id).order("created_at",{ascending:false});
  const {data:milestones=[]}=await sb.from("milestones").select("*").eq("project_id",id).order("created_at",{ascending:true});

  let programmeProjects:any[]=[];
  if(project.programme_id){
    const {data=[]}=await sb.from("projects").select("id,name,health").eq("programme_id",project.programme_id);
    programmeProjects=data;
  }

  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Dependency Intelligence</h1>
    <p style={{color:"#667085"}}>{project.name} · Analyse critical dependencies and simulate schedule impact.</p>

    <DependencyIntelligence
      project={project}
      dependencies={dependencies}
      milestones={milestones}
      programmeProjects={programmeProjects}
    />
  </main>;
}
