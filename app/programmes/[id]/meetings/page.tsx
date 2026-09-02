import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammeMeetings({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme)return <main style={{padding:32}}>Programme not found.</main>;

  const {data:projects=[]}=await sb.from("projects").select("id,name").eq("programme_id",id);
  const ids=projects.map((p:any)=>p.id);
  const {data:meetings=[]}=ids.length
    ? await sb.from("meetings").select("*").in("project_id",ids).order("meeting_date",{ascending:false})
    : {data:[]};

  const names=Object.fromEntries(projects.map((p:any)=>[p.id,p.name]));

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/programmes/"+id}>← Programme</Link>
    <h1>Programme Meeting History</h1>
    <p style={{color:"#667085"}}>{programme.name} · Governance meetings across all projects</p>

    {meetings.length===0?<p>No meetings found.</p>:
      meetings.map((m:any)=><div key={m.id} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:12,padding:16,margin:"10px 0"}}>
        <b>{m.title}</b>
        <div style={{color:"#667085"}}>{names[m.project_id]||"Project"} · {m.meeting_type} · {m.meeting_date?new Date(m.meeting_date).toLocaleString():"No date"}</div>
        <p>{m.minutes_json?.meeting_summary||"No summary"}</p>
      </div>)
    }
  </main>;
}
