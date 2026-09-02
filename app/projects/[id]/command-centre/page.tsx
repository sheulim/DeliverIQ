import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CommandCentre from "@/components/CommandCentre";
import DeliveryIntelligence from "@/components/DeliveryIntelligence";

export default async function CommandCentrePage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const supabase=await createClient();

  const {data:project}=await supabase.from("projects").select("*").eq("id",id).single();
  if(!project) return <main style={{padding:32}}>Project not found.</main>;

  const {data:raid=[]}=await supabase.from("raid_items").select("*").eq("project_id",id).order("created_at",{ascending:false});
  const {data:milestones=[]}=await supabase.from("milestones").select("*").eq("project_id",id).order("created_at",{ascending:true});
  const {data:dependencies=[]}=await supabase.from("dependencies").select("*").eq("project_id",id).order("created_at",{ascending:false});

  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:15}}>
      <div>
        <Link href={"/projects/"+id}>← Project workspace</Link> · <Link href={"/projects/"+id+"/reports"}>Executive Reports</Link>
        <h1 style={{marginBottom:4}}>AI Delivery Command Centre</h1>
        <p style={{color:"#667085"}}>{project.name} · {project.project_type || "Project"} · {project.methodology || "Methodology not set"}</p>
      </div>
      <span style={{padding:"7px 12px",borderRadius:20,background:"#eef2ff",fontWeight:700}}>
        Health: {(project.health || "green").toUpperCase()}
      </span>
    </div>
    <CommandCentre project={project} raid={raid} milestones={milestones} dependencies={dependencies}/>
    <DeliveryIntelligence projectId={id}/>
  </main>;
}
