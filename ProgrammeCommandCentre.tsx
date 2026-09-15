'use client';
import {useMemo,useState} from "react";

export default function ProgrammeCommandCentre({programme,projects}:{programme:any,projects:any[]}){
  const [data,setData]=useState<any>(null);
  const [summary,setSummary]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const rag=useMemo(()=>({
    red:projects.filter(p=>p.health==="red").length,
    amber:projects.filter(p=>p.health==="amber").length,
    green:projects.filter(p=>p.health==="green").length
  }),[projects]);

  async function load(){
    setLoading(true);setError("");
    try{
      const s=await fetch("/api/programmes/"+programme.id+"/summary");
      const sd=await s.json();
      setSummary(sd);

      const r=await fetch("/api/ai/programme-review",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({programmeId:programme.id})
      });
      const d=await r.json();
      if(!r.ok) throw Error(d.error || "Programme review failed.");
      setData(d);
    }catch(e:any){setError(e.message)}finally{setLoading(false)}
  }

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};
  const open=(x:any)=>!["closed","resolved","completed","complete"].includes(String(x.status||"").toLowerCase());

  return <section>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,margin:"20px 0"}}>
      <div style={card}><small>Projects</small><div style={{fontSize:30,fontWeight:850}}>{projects.length}</div></div>
      <div style={card}><small>Green</small><div style={{fontSize:30,fontWeight:850}}>{rag.green}</div></div>
      <div style={card}><small>Amber</small><div style={{fontSize:30,fontWeight:850}}>{rag.amber}</div></div>
      <div style={card}><small>Red</small><div style={{fontSize:30,fontWeight:850}}>{rag.red}</div></div>
      <div style={card}><small>Programme health</small><div style={{fontSize:22,fontWeight:850}}>{String(programme.health||"green").toUpperCase()}</div></div>
    </div>

    <div style={{...card,background:"linear-gradient(135deg,#f4f1ff,#fff)"}}>
      <h2 style={{marginTop:0}}>Programme Intelligence</h2>
      <p style={{color:"#667085"}}>Review all assigned projects, cross-project risks, dependencies and delivery trends.</p>
      <button onClick={load} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading ? "Reviewing programme…" : "Run Programme AI Review ✨"}
      </button>
      {error&&<p style={{color:"#b42318"}}>{error}</p>}
    </div>

    {summary && <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:16}}>
      <div style={card}><small>Open risks</small><div style={{fontSize:28,fontWeight:800}}>{summary.raid.filter((x:any)=>x.item_type==="risk"&&open(x)).length}</div></div>
      <div style={card}><small>Open issues</small><div style={{fontSize:28,fontWeight:800}}>{summary.raid.filter((x:any)=>x.item_type==="issue"&&open(x)).length}</div></div>
      <div style={card}><small>Dependencies</small><div style={{fontSize:28,fontWeight:800}}>{summary.dependencies.filter((x:any)=>open(x)).length}</div></div>
      <div style={card}><small>Milestones</small><div style={{fontSize:28,fontWeight:800}}>{summary.milestones.filter((x:any)=>open(x)).length}</div></div>
    </div>}

    {data && <div style={{display:"grid",gap:14,marginTop:18}}>
      <section style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:15}}>
          <div><h2 style={{margin:"0 0 5px"}}>Executive programme assessment</h2><p>{data.executive_summary}</p></div>
          <div style={{textAlign:"right"}}><b style={{fontSize:22}}>{data.overall_health}</b><br/><span>{data.delivery_confidence}% confidence</span></div>
        </div>
        <small>{data.confidence_note}</small>
      </section>

      <section style={card}>
        <h3>Projects needing intervention</h3>
        {(data.projects_needing_attention||[]).map((x:any,i:number)=>
          <div key={i} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
            <b>{x.project_name}</b>
            <div>{x.reason}</div>
            <small>Recommended intervention: {x.recommended_intervention}</small>
          </div>
        )}
      </section>

      <section style={card}>
        <h3>Systemic risks</h3>
        {(data.systemic_risks||[]).map((x:any,i:number)=>
          <div key={i} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
            <b>{x.theme}</b>
            <div>{x.evidence}</div>
            <div><b>Programme impact:</b> {x.programme_impact}</div>
            <small>Action: {x.recommended_action}</small>
          </div>
        )}
      </section>

      <section style={card}>
        <h3>Dependency hotspots</h3>
        {(data.dependency_hotspots||[]).map((x:any,i:number)=>
          <div key={i} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
            <b>{x.dependency_or_theme}</b>
            <div>Projects affected: {(x.projects_affected||[]).join(", ")}</div>
            <div>{x.why_it_matters}</div>
            <small>Action: {x.action}</small>
          </div>
        )}
      </section>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <section style={card}>
          <h3>Programme priorities</h3>
          <ol>{(data.portfolio_priorities||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>
        </section>
        <section style={card}>
          <h3>Decisions required</h3>
          <ul>{(data.decisions_required||[]).map((x:any,i:number)=><li key={i}><b>{x.decision}</b> — {x.why_needed}</li>)}</ul>
        </section>
      </div>

      <section style={card}>
        <h3>What changed</h3>
        <ul>{(data.what_changed||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      </section>
    </div>}
  </section>;
}
