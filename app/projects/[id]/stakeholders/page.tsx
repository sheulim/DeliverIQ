import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import StakeholderCommunications from "@/components/StakeholderCommunications";

export default async function StakeholdersPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project)return <main style={{padding:32}}>Project not found.</main>;

  const [{data:stakeholders=[]},{data:communications=[]}]=await Promise.all([
    sb.from("stakeholders").select("*").eq("project_id",id).order("created_at",{ascending:false}),
    sb.from("communications").select("*").eq("project_id",id).order("created_at",{ascending:false}).limit(20)
  ]);

  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Stakeholder & Communications Intelligence</h1>
    <p style={{color:"#667085"}}>{project.name} · Map stakeholders and tailor project communications.</p>

    <StakeholderCommunications
      project={project}
      initialStakeholders={stakeholders}
      initialCommunications={communications}
    />
  </main>;
}
