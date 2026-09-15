'use client';
import {useMemo, useState} from "react";

export default function CommandCentre({project,raid,milestones,dependencies}:{project:any,raid:any[],milestones:any[],dependencies:any[]}) {
  const [analysis,setAnalysis]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const counts=useMemo(()=>({
    risks:raid.filter(x=>x.item_type==="risk" && x.status!=="closed").length,
    issues:raid.filter(x=>x.item_type==="issue" && x.status!=="closed").length,
    decisions:raid.filter(x=>x.item_type==="decision" && x.status!=="closed").length,
    assumptions:raid.filter(x=>x.item_type==="assumption" && x.status!=="closed").length,
    dependencies:dependencies.filter(x=>x.status!=="closed").length,
    milestones:milestones.filter(x=>x.status!=="complete" && x.status!=="completed").length
  }),[raid,milestones,dependencies]);

  async function review() {
    setLoading(true); setError(""); setAnalysis(null);
    try {
      const r=await fetch("/api/ai/delivery-review",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({projectId:project.id})
      });
      const d=await r.json();
      if(!r.ok) throw Error(d.error || "Review failed");
      setAnalysis(d);
    } catch(e:any) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  return <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,margin:"25px 0"}}>
      {[
        ["Open risks",counts.risks],["Open issues",counts.issues],["Decisions",counts.decisions],
        ["Assumptions",counts.assumptions],["Dependencies",counts.dependencies],["Milestones",counts.milestones]
      ].map(([label,value])=>
        <div key={label as string} style={card}><div style={{color:"#667085",fontSize:12}}>{label}</div><div style={{fontSize:28,fontWeight:800,marginTop:7}}>{value}</div></div>
      )}
    </div>

    <div style={{...card,background:"linear-gradient(135deg,#f7f5ff,#fff)"}}>
      <h2 style={{marginTop:0}}>Ask DeliverIQ: “What needs my attention?”</h2>
      <p style={{color:"#667085"}}>The AI reviews the saved project, RAID, milestones and dependencies and produces an executive delivery assessment.</p>
      <button onClick={review} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750,cursor:"pointer"}}>
        {loading ? "Reviewing project…" : "Run AI Delivery Review ✨"}
      </button>
      {error && <p style={{color:"#b42318"}}>{error}</p>}
    </div>

    {analysis && <div style={{marginTop:20,display:"grid",gap:15}}>
      <section style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2>Executive assessment</h2>
          <b style={{fontSize:20}}>{String(analysis.overall_health || "GREEN").toUpperCase()}</b>
        </div>
        <p>{analysis.executive_summary}</p>
      </section>

      <section style={card}>
        <h2>Attention queue</h2>
        {(analysis.attention_items||[]).map((x:any,i:number)=>
          <div key={i} style={{padding:"14px 0",borderBottom:"1px solid #eee"}}>
            <b>{i+1}. {x.title}</b>
            <div style={{color:"#667085",marginTop:5}}>{x.reason}</div>
            <div style={{marginTop:7}}><b>Recommended action:</b> {x.recommended_action}</div>
            <small>Urgency: {x.urgency} · Owner: {x.owner_role || "Delivery Lead"}</small>
          </div>
        )}
        {!analysis.attention_items?.length && <p>No urgent attention items identified.</p>}
      </section>

      <section style={card}>
        <h2>Delivery signals</h2>
        <ul>{(analysis.delivery_signals||[]).map((x:any,i:number)=><li key={i}>{x}</li>)}</ul>
      </section>

      <section style={card}>
        <h2>Recommended next actions</h2>
        <ol>{(analysis.next_actions||[]).map((x:any,i:number)=><li key={i} style={{marginBottom:8}}>{x}</li>)}</ol>
      </section>

      <section style={card}>
        <h2>Questions for the delivery team</h2>
        <ul>{(analysis.questions_for_team||[]).map((x:any,i:number)=><li key={i}>{x}</li>)}</ul>
      </section>
    </div>}
  </>;
}
