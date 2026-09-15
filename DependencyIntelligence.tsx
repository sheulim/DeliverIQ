'use client';
import {useMemo,useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function DependencyIntelligence({project,dependencies:initialDeps,milestones,programmeProjects}:{project:any,dependencies:any[],milestones:any[],programmeProjects:any[]}){
  const [deps,setDeps]=useState(initialDeps);
  const [selected,setSelected]=useState<any>(initialDeps[0] || null);
  const [slipDays,setSlipDays]=useState(10);
  const [result,setResult]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  const stats=useMemo(()=>({
    total:deps.length,
    blocked:deps.filter(d=>["blocked","red","overdue"].includes(String(d.status||"").toLowerCase())).length,
    linkedMilestones:deps.filter(d=>d.milestone_id).length,
    crossProject:deps.filter(d=>d.downstream_project_id).length
  }),[deps]);

  async function updateLink(dep:any,field:string,value:string){
    const patch:any={[field]:value||null};
    const {error}=await supabase.from("dependencies").update(patch).eq("id",dep.id);
    if(error) return setMessage(error.message);
    const next=deps.map(d=>d.id===dep.id?{...d,...patch}:d);
    setDeps(next);
    setSelected(next.find(d=>d.id===dep.id));
  }

  async function simulate(){
    if(!selected) return;
    setLoading(true);setMessage("");setResult(null);
    try{
      const r=await fetch("/api/ai/impact-simulation",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({dependencyId:selected.id,slipDays})
      });
      const d=await r.json();
      if(!r.ok) throw Error(d.error || "Simulation failed.");
      setResult(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  return <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,margin:"22px 0"}}>
      <div style={card}><small>Dependencies</small><div style={{fontSize:30,fontWeight:850}}>{stats.total}</div></div>
      <div style={card}><small>Blocked / overdue</small><div style={{fontSize:30,fontWeight:850}}>{stats.blocked}</div></div>
      <div style={card}><small>Milestone linked</small><div style={{fontSize:30,fontWeight:850}}>{stats.linkedMilestones}</div></div>
      <div style={card}><small>Cross-project</small><div style={{fontSize:30,fontWeight:850}}>{stats.crossProject}</div></div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <section style={card}>
        <h2>Dependency Map</h2>
        {deps.length===0?<p>No dependencies found.</p>:deps.map(d=>
          <button key={d.id} onClick={()=>{setSelected(d);setResult(null)}} style={{
            display:"block",width:"100%",textAlign:"left",padding:13,margin:"8px 0",
            border:selected?.id===d.id?"2px solid #635bff":"1px solid #e6e8ef",
            borderRadius:10,background:"#fff"
          }}>
            <b>{d.title}</b>
            <div style={{color:"#667085",marginTop:4}}>{d.provider || "Provider?"} → {d.consumer || "Consumer?"} · {d.status || "open"}</div>
          </button>
        )}
      </section>

      <section style={card}>
        <h2>Dependency Details</h2>
        {!selected?<p>Select a dependency.</p>:<>
          <h3>{selected.title}</h3>
          <p>{selected.impact || "No impact statement recorded."}</p>

          <label style={{display:"block",marginTop:12}}>Linked milestone
            <select value={selected.milestone_id||""} onChange={e=>updateLink(selected,"milestone_id",e.target.value)} style={{display:"block",width:"100%",padding:9,marginTop:5}}>
              <option value="">None</option>
              {milestones.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>

          <label style={{display:"block",marginTop:12}}>Downstream project
            <select value={selected.downstream_project_id||""} onChange={e=>updateLink(selected,"downstream_project_id",e.target.value)} style={{display:"block",width:"100%",padding:9,marginTop:5}}>
              <option value="">None</option>
              {programmeProjects.filter(p=>p.id!==project.id).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>

          <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid #eee"}}>
            <h3>What happens if this slips?</h3>
            <label>Slip scenario
              <select value={slipDays} onChange={e=>setSlipDays(Number(e.target.value))} style={{marginLeft:8,padding:8}}>
                {[5,10,14,21,30].map(n=><option key={n} value={n}>{n} days</option>)}
              </select>
            </label>
            <button onClick={simulate} disabled={loading} style={{display:"block",marginTop:12,padding:"10px 14px",background:"#635bff",color:"#fff",border:0,borderRadius:8,fontWeight:750}}>
              {loading?"Simulating impact…":"Run Impact Simulation ✨"}
            </button>
            {message&&<p style={{color:"#b42318"}}>{message}</p>}
          </div>
        </>}
      </section>
    </div>

    {result&&<section style={{...card,marginTop:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{marginBottom:4}}>Impact Simulation</h2>
          <p style={{color:"#667085"}}>{result.analysis.scenario_summary}</p>
        </div>
        <b style={{fontSize:22}}>{result.analysis.severity}</b>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <h3>Direct impacts</h3>
          <ul>{(result.analysis.direct_impacts||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
        </div>
        <div>
          <h3>Potential downstream impacts</h3>
          <ul>{(result.analysis.potential_downstream_impacts||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
        </div>
      </div>

      <h3>Projects affected</h3>
      {(result.analysis.projects_affected||[]).map((x:any,i:number)=>
        <div key={i} style={{padding:"9px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.project_name}</b> — {x.impact} <small>({x.confidence} confidence)</small>
        </div>
      )}

      <h3>Milestones at risk</h3>
      {(result.analysis.milestones_at_risk||[]).map((x:any,i:number)=>
        <div key={i} style={{padding:"9px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.milestone_name}</b> / {x.project_name} — {x.impact} <small>({x.confidence})</small>
        </div>
      )}

      <h3>Critical-path signal</h3>
      <p>{result.analysis.critical_path_signal}</p>

      <h3>Recommended actions</h3>
      <ol>{(result.analysis.recommended_actions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>

      <h3>Escalation recommendation</h3>
      <p>{result.analysis.escalation_recommendation}</p>

      <h3>Executive message</h3>
      <p>{result.analysis.executive_message}</p>

      <h3>Assumptions / unknowns</h3>
      <ul>{(result.analysis.assumptions_and_unknowns||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
    </section>}
  </>;
}
