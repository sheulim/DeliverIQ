import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import ProgrammeCommandCentre from "@/components/ProgrammeCommandCentre";
import ProgrammeProjectManager from "@/components/ProgrammeProjectManager";

export default async function ProgrammePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme) return <main style={{padding:32}}>Programme not found.<p><Link href={"/programmes/"+id+"/changes"}>Programme Change Control →</Link></p></main>;

  const {data:projects=[]}=await sb.from("projects").select("*").eq("programme_id",id).order("created_at",{ascending:false});
  const {data:unassigned=[]}=await sb.from("projects").select("id,name,health,project_type").is("programme_id",null).order("created_at",{ascending:false});

  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <Link href="/programmes">← Programmes</Link>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,marginTop:10}}>
      <div>
        <h1 style={{marginBottom:4}}>{programme.name}</h1>
        <p style={{color:"#667085"}}>{programme.description || "Programme delivery intelligence"} · Owner: {programme.owner || "Not set"}</p>
      </div>
      <b>{String(programme.health || "green").toUpperCase()}</b>
    </div>

    <p><Link href={"/programmes/"+id+"/dependencies"}>Open Dependency Heatmap →</Link> · <Link href={"/programmes/"+id+"/commitments"}>Programme Commitments →</Link> · <Link href={"/programmes/"+id+"/meetings"}>Programme Meetings →</Link> · <Link href={"/programmes/"+id+"/stakeholders"}>Programme Stakeholders →</Link> · <Link href={"/programmes/"+id+"/value"}>Programme Value Realisation →</Link> · <Link href={"/programmes/"+id+"/capacity"}>Programme Capacity →</Link> · <Link href={"/programmes/"+id+"/finance"}>Programme Financial Intelligence →</Link></p>
    <ProgrammeProjectManager programmeId={id} projects={projects} unassigned={unassigned}/>
    <ProgrammeCommandCentre programme={programme} projects={projects}/>
  <p><Link href={"/programmes/"+id+"/changes"}>Programme Change Control →</Link></p></main>;
}
