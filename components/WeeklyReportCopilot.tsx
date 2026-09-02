'use client';
import {useState} from "react";

export default function WeeklyReportCopilot({projectId}:{projectId:string}){
  const [report,setReport]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  async function generate(){
    setLoading(true);setMessage("");
    try{
      const r=await fetch("/api/ai/status-report",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({projectId,reportType:"weekly"})
      });
      const d=await r.json();
      if(!r.ok) throw Error(d.error || "Report generation failed.");
      setReport(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  async function save(){
    if(!report) return;
    setMessage("");
    const r=await fetch("/api/reports",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({projectId,reportType:"weekly",report})
    });
    const d=await r.json();
    if(!r.ok) setMessage(d.error || "Save failed.");
    else setMessage("Report saved to DeliverIQ history.");
  }

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  return <section>
    <div style={{...card,background:"linear-gradient(135deg,#f4f1ff,#fff)"}}>
      <h2 style={{marginTop:0}}>Weekly Delivery Copilot</h2>
      <p style={{color:"#667085"}}>Generate an executive status report from the current project, RAID, milestones, dependencies and recent delivery trends.</p>
      <button onClick={generate} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading ? "Preparing executive report…" : "Generate Weekly Report ✨"}
      </button>
      {message && <p>{message}</p>}
    </div>

    {report && <div style={{display:"grid",gap:14,marginTop:18}}>
      <section style={card}>
        <div style={{display:"flex",justifyContent:"space-between",gap:15,alignItems:"center"}}>
          <div>
            <h2 style={{margin:"0 0 4px"}}>{report.report_title}</h2>
            <div style={{color:"#667085"}}>{report.reporting_period}</div>
          </div>
          <div style={{fontWeight:850,fontSize:20}}>{report.overall_health}</div>
        </div>
        <p>{report.executive_summary}</p>
        <small>{report.confidence_note}</small>
      </section>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <section style={card}>
          <h3>Achievements</h3>
          <ul>{(report.achievements||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
        </section>
        <section style={card}>
          <h3>Current status</h3>
          <ul>{(report.current_status||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
        </section>
      </div>

      <section style={card}>
        <h3>Top risks & issues</h3>
        {(report.top_risks_issues||[]).map((x:any,i:number)=>
          <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #eee"}}>
            <b>{x.type}: {x.title}</b>
            <div>{x.impact}</div>
            <small>Action: {x.mitigation_or_action}</small>
          </div>
        )}
      </section>

      <section style={card}>
        <h3>Decisions required</h3>
        {(report.decisions_required||[]).map((x:any,i:number)=>
          <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #eee"}}>
            <b>{x.decision}</b>
            <div>{x.why_needed}</div>
            <small>Owner / forum: {x.owner_or_forum}</small>
          </div>
        )}
      </section>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <section style={card}>
          <h3>Next-week priorities</h3>
          <ol>{(report.next_week_priorities||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>
        </section>
        <section style={card}>
          <h3>Executive asks</h3>
          <ul>{(report.executive_asks||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
        </section>
      </div>

      <section style={card}>
        <h3>What changed since last report</h3>
        <ul>{(report.what_changed_since_last_report||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      </section>

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={save} style={{padding:"11px 16px",border:"1px solid #d8dbe6",borderRadius:9,background:"#fff",fontWeight:750}}>
          Save Reviewed Report
        </button>
      </div>
    </div>}
  </section>;
}
