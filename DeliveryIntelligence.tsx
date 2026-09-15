'use client';
import {useState} from "react";

export default function DeliveryIntelligence({projectId}:{projectId:string}){
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  async function run(){
    setLoading(true);setMessage("");
    try{
      const snap=await fetch("/api/delivery/snapshot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({projectId})});
      if(!snap.ok) throw Error("Could not save snapshot.");
      const r=await fetch("/api/ai/delivery-intelligence",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({projectId})});
      const d=await r.json();
      if(!r.ok) throw Error(d.error || "Intelligence review failed.");
      setData(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};
  const intel=data?.intelligence;
  const snap=data?.current_snapshot;

  return <section style={{marginTop:22}}>
    <div style={{...card,background:"linear-gradient(135deg,#f2f0ff,#fff)"}}>
      <h2 style={{marginTop:0}}>Delivery Intelligence</h2>
      <p style={{color:"#667085"}}>Compare this project with its last saved delivery snapshot and surface trend signals.</p>
      <button onClick={run} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading ? "Analysing trends…" : "What changed since last review? ✨"}
      </button>
      {message && <p style={{color:"#b42318"}}>{message}</p>}
    </div>

    {data && <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:16}}>
        <div style={card}><small>Delivery confidence</small><div style={{fontSize:31,fontWeight:850}}>{snap.delivery_confidence}%</div></div>
        <div style={card}><small>High risks</small><div style={{fontSize:31,fontWeight:850}}>{snap.high_risks}</div></div>
        <div style={card}><small>Overdue dependencies</small><div style={{fontSize:31,fontWeight:850}}>{snap.overdue_dependencies}</div></div>
        <div style={card}><small>Ageing RAID</small><div style={{fontSize:31,fontWeight:850}}>{snap.ageing_raid}</div></div>
      </div>

      <div style={{...card,marginTop:16}}>
        <h2>{intel.headline}</h2>
        <p>{intel.executive_summary}</p>
        <p><b>Confidence:</b> {intel.confidence_label} — {intel.confidence_explanation}</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:16}}>
        <div style={card}><h3>What changed</h3><ul>{(intel.what_changed||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul></div>
        <div style={card}><h3>Deteriorating signals</h3><ul>{(intel.deteriorating_signals||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul></div>
      </div>

      <div style={{...card,marginTop:16}}>
        <h3>Predictive watchlist</h3>
        {(intel.predictive_watchlist||[]).map((x:any,i:number)=>
          <div key={i} style={{padding:"14px 0",borderBottom:"1px solid #eee"}}>
            <b>{x.signal}</b>
            <p style={{margin:"6px 0"}}>{x.why_it_matters}</p>
            <small><b>Watch for:</b> {x.watch_for}</small><br/>
            <small><b>Recommended action:</b> {x.recommended_action}</small>
          </div>
        )}
      </div>

      <div style={{...card,marginTop:16}}>
        <h3>Next actions</h3>
        <ol>{(intel.next_actions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>
      </div>
    </>}
  </section>;
}
