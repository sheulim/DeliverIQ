import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import RaidManager from "@/components/RaidManager";

export default async function ProjectPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const supabase=await createClient();
  const {data:project}=await supabase.from("projects").select("*").eq("id",id).single();
  if (!project) return <main style={{padding:32}}>Project not found.<p><Link href={"/projects/"+id+"/dependencies"}>Dependency Intelligence →</Link></p><p><Link href={"/projects/"+id+"/actions"}>Action & Decision Intelligence →</Link></p><p><Link href={"/projects/"+id+"/meetings"}>Meeting Intelligence →</Link></p><p><Link href={"/projects/"+id+"/stakeholders"}>Stakeholder & Communications Intelligence →</Link></p><p><Link href={"/projects/"+id+"/value"}>Benefits, OKR & Value Realisation →</Link></p><p><Link href={"/projects/"+id+"/capacity"}>Resource, Capacity & Delivery Forecast →</Link></p><p><Link href={"/projects/"+id+"/finance"}>Financial & Budget Intelligence →</Link></p><p><Link href={"/projects/"+id+"/changes"}>Change, Scope & Requirements Intelligence →</Link></p><p><Link href={"/projects/"+id+"/integrations"}>Delivery Data Hub →</Link></p><p><Link href={"/projects/"+id+"/copilot"}>AI PM Workspace →</Link></p></main>;

  const {data:raid=[]}=await supabase.from("raid_items").select("*").eq("project_id",id);

  return <main style={{padding:32}}>
    <Link href="/projects">← Projects</Link>
    <h1>{project.name}</h1>
    <p>{project.project_type || "Project"} · {project.methodology || "Methodology not set"} · Health: {project.health || "green"}</p>
    <div style={{display:"flex",gap:24}}>
      <b>Open risks: {raid.filter((x:any)=>x.item_type==="risk"&&x.status!=="closed").length}</b>
      <b>Open issues: {raid.filter((x:any)=>x.item_type==="issue"&&x.status!=="closed").length}</b>
      <b>RAID items: {raid.length}</b>
    </div>
    <RaidManager projectId={id} initialItems={raid}/>
  <p><Link href={"/projects/"+id+"/dependencies"}>Dependency Intelligence →</Link></p><p><Link href={"/projects/"+id+"/actions"}>Action & Decision Intelligence →</Link></p><p><Link href={"/projects/"+id+"/meetings"}>Meeting Intelligence →</Link></p><p><Link href={"/projects/"+id+"/stakeholders"}>Stakeholder & Communications Intelligence →</Link></p><p><Link href={"/projects/"+id+"/value"}>Benefits, OKR & Value Realisation →</Link></p><p><Link href={"/projects/"+id+"/capacity"}>Resource, Capacity & Delivery Forecast →</Link></p><p><Link href={"/projects/"+id+"/finance"}>Financial & Budget Intelligence →</Link></p><p><Link href={"/projects/"+id+"/changes"}>Change, Scope & Requirements Intelligence →</Link></p><p><Link href={"/projects/"+id+"/integrations"}>Delivery Data Hub →</Link></p><p><Link href={"/projects/"+id+"/copilot"}>AI PM Workspace →</Link></p></main>;
}

