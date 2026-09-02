import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import MeetingCopilot from "@/components/MeetingCopilot";

export default async function MeetingsPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project)return <main style={{padding:32}}>Project not found.</main>;

  const {data:meetings=[]}=await sb.from("meetings").select("*").eq("project_id",id).order("meeting_date",{ascending:false});

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Meeting Intelligence & Governance Copilot</h1>
    <p style={{color:"#667085"}}>{project.name} · Convert meeting notes into structured minutes, actions and decisions.</p>

    <MeetingCopilot project={project}/>

    <section style={{marginTop:28}}>
      <h2>Meeting history</h2>
      {meetings.length===0?<p>No saved meetings yet.</p>:
        meetings.map((m:any)=><div key={m.id} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:12,padding:16,margin:"10px 0"}}>
          <b>{m.title}</b>
          <div style={{color:"#667085",marginTop:4}}>{m.meeting_type} · {m.meeting_date ? new Date(m.meeting_date).toLocaleString() : "Date not set"}</div>
          <p>{m.minutes_json?.meeting_summary || "No generated summary."}</p>
        </div>)
      }
    </section>
  </main>;
}
