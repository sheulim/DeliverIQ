import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import WeeklyReportCopilot from "@/components/WeeklyReportCopilot";

export default async function ReportsPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project) return <main style={{padding:32}}>Project not found.</main>;

  const {data:reports=[]}=await sb
    .from("status_reports")
    .select("*")
    .eq("project_id",id)
    .order("created_at",{ascending:false})
    .limit(12);

  return <main style={{padding:32,maxWidth:1180,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Executive Reporting</h1>
    <p style={{color:"#667085"}}>{project.name} · Weekly delivery and steering-committee reports</p>

    <WeeklyReportCopilot projectId={id}/>

    <section style={{marginTop:28}}>
      <h2>Report history</h2>
      {reports.length===0 ? <p>No saved reports yet.</p> :
        reports.map((r:any)=>
          <div key={r.id} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:12,padding:16,margin:"10px 0"}}>
            <b>{r.report_json?.report_title || "Status Report"}</b>
            <div style={{color:"#667085",marginTop:4}}>
              {r.reporting_period || "Period not specified"} · {r.overall_health || "Health not set"} · {new Date(r.created_at).toLocaleString()}
            </div>
            <p>{r.executive_summary}</p>
          </div>
        )
      }
    </section>
  </main>;
}
