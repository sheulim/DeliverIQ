'use client';
import {useMemo,useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function CapacityForecastManager({project,initialResources,initialPeriods,forecasts}:{project:any,initialResources:any[],initialPeriods:any[],forecasts:any[]}){
  const [resources,setResources]=useState(initialResources);
  const [periods,setPeriods]=useState(initialPeriods);
  const [review,setReview]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [targetDate,setTargetDate]=useState("");

  const [r,setR]=useState({name:"",role:"",team:"",capacity_per_period:"",allocation_percent:"100",available_from:"",available_to:"",status:"active",notes:""});
  const [p,setP]=useState({period_start:"",period_end:"",planned_capacity:"",planned_demand:"",delivered_throughput:"",unit:"points",notes:""});

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  const metrics=useMemo(()=>{
    const active=resources.filter(x=>String(x.status||"").toLowerCase()==="active");
    const effective=active.reduce((s,x)=>s+Number(x.capacity_per_period||0)*(Number(x.allocation_percent??100)/100),0);
    const recent=[...periods].slice(0,6);
    const avg=(key:string)=>recent.length?recent.reduce((s,x)=>s+Number(x[key]||0),0)/recent.length:null;
    const demand=avg("planned_demand"),throughput=avg("delivered_throughput");
    return {
      active:active.length,
      effective:Math.round(effective*100)/100,
      demand:demand===null?null:Math.round(demand*100)/100,
      throughput:throughput===null?null:Math.round(throughput*100)/100,
      coverage:demand&&demand>0?Math.round((effective/demand)*100):null
    };
  },[resources,periods]);

  async function addResource(){
    if(!r.name.trim())return;
    const {data,error}=await supabase.from("resources").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      ...r,
      capacity_per_period:r.capacity_per_period===""?null:Number(r.capacity_per_period),
      allocation_percent:r.allocation_percent===""?100:Number(r.allocation_percent),
      available_from:r.available_from||null,available_to:r.available_to||null
    }).select().single();
    if(error)return setMessage(error.message);
    setResources([data,...resources]);
    setR({name:"",role:"",team:"",capacity_per_period:"",allocation_percent:"100",available_from:"",available_to:"",status:"active",notes:""});
  }

  async function addPeriod(){
    if(!p.period_start||!p.period_end)return;
    const {data,error}=await supabase.from("capacity_periods").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      period_start:p.period_start,period_end:p.period_end,
      planned_capacity:p.planned_capacity===""?null:Number(p.planned_capacity),
      planned_demand:p.planned_demand===""?null:Number(p.planned_demand),
      delivered_throughput:p.delivered_throughput===""?null:Number(p.delivered_throughput),
      unit:p.unit,notes:p.notes||null
    }).select().single();
    if(error)return setMessage(error.message);
    setPeriods([data,...periods]);
    setP({period_start:"",period_end:"",planned_capacity:"",planned_demand:"",delivered_throughput:"",unit:"points",notes:""});
  }

  async function aiReview(){
    setLoading(true);setMessage("");setReview(null);
    try{
      const res=await fetch("/api/ai/delivery-forecast",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({projectId:project.id,targetDate:targetDate||null})
      });
      const d=await res.json();
      if(!res.ok)throw Error(d.error||"Forecast failed.");
      setReview(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  return <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,margin:"20px 0"}}>
      <div style={card}><small>Active resources</small><div style={{fontSize:30,fontWeight:850}}>{metrics.active}</div></div>
      <div style={card}><small>Effective capacity</small><div style={{fontSize:30,fontWeight:850}}>{metrics.effective}</div></div>
      <div style={card}><small>Avg demand</small><div style={{fontSize:30,fontWeight:850}}>{metrics.demand??"—"}</div></div>
      <div style={card}><small>Avg throughput</small><div style={{fontSize:30,fontWeight:850}}>{metrics.throughput??"—"}</div></div>
      <div style={card}><small>Demand coverage</small><div style={{fontSize:30,fontWeight:850}}>{metrics.coverage===null?"—":metrics.coverage+"%"}</div></div>
    </div>

    <section style={{...card,background:"linear-gradient(135deg,#f4f1ff,#fff)",marginBottom:18}}>
      <h2 style={{marginTop:0}}>Delivery Forecast Intelligence</h2>
      <p style={{color:"#667085"}}>Test whether current capacity, throughput and delivery pressure support the target date.</p>
      <input type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} style={{padding:9,marginRight:8}}/>
      <button onClick={aiReview} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading?"Assessing forecast…":"Can we realistically deliver by this date? ✨"}
      </button>
      {message&&<p>{message}</p>}
    </section>

    {review&&<section style={{...card,marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:14}}>
        <div>
          <h2>{review.review.headline}</h2>
          <p>{review.review.executive_summary}</p>
        </div>
        <div style={{textAlign:"right"}}>
          <b style={{fontSize:22}}>{review.review.forecast_health}</b><br/>
          <span>{review.review.confidence_score ?? review.deterministic_confidence}% confidence</span>
        </div>
      </div>
      <h3>Capacity assessment</h3>
      <p>{review.review.capacity_assessment}</p>
      <h3>Resource bottlenecks</h3>
      {(review.review.resource_bottlenecks||[]).map((x:any,i:number)=><div key={i} style={{padding:"9px 0",borderBottom:"1px solid #eee"}}>
        <b>{x.bottleneck}</b> — {x.evidence}<div><small>Impact: {x.impact} · Action: {x.recommended_action}</small></div>
      </div>)}
      <h3>Schedule pressures</h3>
      <ul>{(review.review.schedule_pressures||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      <h3>Forecast scenarios</h3>
      {(review.review.forecast_scenarios||[]).map((x:any,i:number)=><div key={i} style={{padding:"9px 0",borderBottom:"1px solid #eee"}}>
        <b>{x.scenario}</b> — {x.conditions}<div>{x.outcome}</div>
      </div>)}
      <h3>Recommended actions</h3>
      <ol>{(review.review.recommended_actions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>
      <small>{review.review.confidence_note}</small>
    </section>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <section style={card}>
        <h2>Resource Register</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input placeholder="Name" value={r.name} onChange={e=>setR({...r,name:e.target.value})}/>
          <input placeholder="Role" value={r.role} onChange={e=>setR({...r,role:e.target.value})}/>
          <input placeholder="Team" value={r.team} onChange={e=>setR({...r,team:e.target.value})}/>
          <input placeholder="Capacity / period" value={r.capacity_per_period} onChange={e=>setR({...r,capacity_per_period:e.target.value})}/>
          <input placeholder="Allocation %" value={r.allocation_percent} onChange={e=>setR({...r,allocation_percent:e.target.value})}/>
          <select value={r.status} onChange={e=>setR({...r,status:e.target.value})}>
            <option value="active">Active</option><option value="planned">Planned</option><option value="unavailable">Unavailable</option>
          </select>
        </div>
        <button onClick={addResource} style={{marginTop:8}}>Add Resource</button>
        {resources.map(x=><div key={x.id} style={{padding:"11px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.name}</b>
          <div style={{color:"#667085"}}>{x.role||"Role not set"} · {x.team||"No team"} · Capacity {x.capacity_per_period??"—"} · Allocation {x.allocation_percent??100}%</div>
        </div>)}
      </section>

      <section style={card}>
        <h2>Capacity & Throughput History</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input type="date" value={p.period_start} onChange={e=>setP({...p,period_start:e.target.value})}/>
          <input type="date" value={p.period_end} onChange={e=>setP({...p,period_end:e.target.value})}/>
          <input placeholder="Planned capacity" value={p.planned_capacity} onChange={e=>setP({...p,planned_capacity:e.target.value})}/>
          <input placeholder="Planned demand" value={p.planned_demand} onChange={e=>setP({...p,planned_demand:e.target.value})}/>
          <input placeholder="Delivered throughput" value={p.delivered_throughput} onChange={e=>setP({...p,delivered_throughput:e.target.value})}/>
          <input placeholder="Unit" value={p.unit} onChange={e=>setP({...p,unit:e.target.value})}/>
        </div>
        <button onClick={addPeriod} style={{marginTop:8}}>Add Period</button>
        {periods.map(x=><div key={x.id} style={{padding:"11px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.period_start} → {x.period_end}</b>
          <div style={{color:"#667085"}}>Capacity {x.planned_capacity??"—"} · Demand {x.planned_demand??"—"} · Throughput {x.delivered_throughput??"—"} {x.unit||""}</div>
        </div>)}
      </section>
    </div>
  </>;
}
