'use client';
import {useMemo,useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function FinancialIntelligence({project,initialBudget,initialCosts,initialForecasts,reviews}:{project:any,initialBudget:any,initialCosts:any[],initialForecasts:any[],reviews:any[]}){
  const [budget,setBudget]=useState(initialBudget);
  const [costs,setCosts]=useState(initialCosts);
  const [forecasts,setForecasts]=useState(initialForecasts);
  const [review,setReview]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  const [budgetForm,setBudgetForm]=useState({
    approved_budget:initialBudget?.approved_budget?.toString()||"",
    contingency_budget:initialBudget?.contingency_budget?.toString()||"",
    currency:initialBudget?.currency||"USD",
    baseline_date:initialBudget?.baseline_date||"",
    notes:initialBudget?.notes||""
  });

  const [cost,setCost]=useState({cost_date:"",category:"",description:"",cost_type:"actual",amount:"",owner:"",vendor:""});
  const [fc,setFc]=useState({forecast_date:"",estimate_to_complete:"",estimate_at_completion:"",forecast_method:"manual",assumptions:""});

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  const metrics=useMemo(()=>{
    const approved=Number(budget?.approved_budget||0);
    const actual=costs.filter(x=>String(x.cost_type||"actual").toLowerCase()==="actual").reduce((s,x)=>s+Number(x.amount||0),0);
    const commitments=costs.filter(x=>["commitment","accrual"].includes(String(x.cost_type||"").toLowerCase())).reduce((s,x)=>s+Number(x.amount||0),0);
    const latest=forecasts[0]||null;
    const etc=latest?.estimate_to_complete!=null?Number(latest.estimate_to_complete):null;
    const eac=latest?.estimate_at_completion!=null?Number(latest.estimate_at_completion):(etc!=null?actual+etc:actual+commitments);
    const variance=approved?approved-eac:null;
    const burn=approved?Math.round((actual/approved)*10000)/100:null;
    return {approved,actual,commitments,etc,eac,variance,burn};
  },[budget,costs,forecasts]);

  async function saveBudget(){
    const payload={
      project_id:project.id,
      programme_id:project.programme_id||null,
      approved_budget:budgetForm.approved_budget===""?null:Number(budgetForm.approved_budget),
      contingency_budget:budgetForm.contingency_budget===""?0:Number(budgetForm.contingency_budget),
      currency:budgetForm.currency,
      baseline_date:budgetForm.baseline_date||null,
      notes:budgetForm.notes||null
    };
    let q;
    if(budget?.id) q=supabase.from("project_budgets").update(payload).eq("id",budget.id).select().single();
    else q=supabase.from("project_budgets").insert(payload).select().single();
    const {data,error}=await q;
    if(error)return setMessage(error.message);
    setBudget(data);
    setMessage("Budget saved.");
  }

  async function addCost(){
    if(!cost.cost_date||!cost.category||!cost.amount)return;
    const {data,error}=await supabase.from("cost_entries").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      cost_date:cost.cost_date,category:cost.category,description:cost.description||null,
      cost_type:cost.cost_type,amount:Number(cost.amount),owner:cost.owner||null,vendor:cost.vendor||null
    }).select().single();
    if(error)return setMessage(error.message);
    setCosts([data,...costs]);
    setCost({cost_date:"",category:"",description:"",cost_type:"actual",amount:"",owner:"",vendor:""});
  }

  async function addForecast(){
    const {data,error}=await supabase.from("financial_forecasts").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      forecast_date:fc.forecast_date||new Date().toISOString().slice(0,10),
      estimate_to_complete:fc.estimate_to_complete===""?null:Number(fc.estimate_to_complete),
      estimate_at_completion:fc.estimate_at_completion===""?null:Number(fc.estimate_at_completion),
      forecast_method:fc.forecast_method,assumptions:fc.assumptions||null
    }).select().single();
    if(error)return setMessage(error.message);
    setForecasts([data,...forecasts]);
    setFc({forecast_date:"",estimate_to_complete:"",estimate_at_completion:"",forecast_method:"manual",assumptions:""});
  }

  async function aiReview(){
    setLoading(true);setMessage("");setReview(null);
    try{
      const r=await fetch("/api/ai/financial-review",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({projectId:project.id})
      });
      const d=await r.json();
      if(!r.ok)throw Error(d.error||"Review failed.");
      setReview(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  const money=(v:any)=>v==null?"—":`${budget?.currency||budgetForm.currency||"USD"} ${Number(v).toLocaleString()}`;

  return <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,margin:"20px 0"}}>
      <div style={card}><small>Approved budget</small><div style={{fontSize:24,fontWeight:850}}>{money(metrics.approved)}</div></div>
      <div style={card}><small>Actual spend</small><div style={{fontSize:24,fontWeight:850}}>{money(metrics.actual)}</div></div>
      <div style={card}><small>Commitments</small><div style={{fontSize:24,fontWeight:850}}>{money(metrics.commitments)}</div></div>
      <div style={card}><small>ETC</small><div style={{fontSize:24,fontWeight:850}}>{money(metrics.etc)}</div></div>
      <div style={card}><small>EAC</small><div style={{fontSize:24,fontWeight:850}}>{money(metrics.eac)}</div></div>
      <div style={card}><small>Variance</small><div style={{fontSize:24,fontWeight:850}}>{money(metrics.variance)}</div></div>
    </div>

    <section style={{...card,background:"linear-gradient(135deg,#f4f1ff,#fff)",marginBottom:18}}>
      <h2 style={{marginTop:0}}>Financial Intelligence</h2>
      <p style={{color:"#667085"}}>Review burn rate, forecast position and likely budget pressure.</p>
      <button onClick={aiReview} disabled={loading} style={{padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading?"Reviewing financials…":"Are we likely to exceed budget? ✨"}
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
          <b style={{fontSize:22}}>{review.review.financial_health}</b><br/>
          <span>{money(review.metrics.variance)} variance</span>
        </div>
      </div>
      <h3>Budget position</h3><p>{review.review.budget_position}</p>
      <h3>Variance drivers</h3><ul>{(review.review.variance_drivers||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      <h3>Forecast risks</h3>
      {(review.review.forecast_risks||[]).map((x:any,i:number)=><div key={i} style={{padding:"9px 0",borderBottom:"1px solid #eee"}}>
        <b>{x.risk}</b> — {x.evidence}<div><small>Impact: {x.impact} · Action: {x.recommended_action}</small></div>
      </div>)}
      <h3>Cost control actions</h3><ol>{(review.review.cost_control_actions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ol>
      <small>{review.review.confidence_note}</small>
    </section>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <section style={card}>
        <h2>Budget</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input placeholder="Approved budget" value={budgetForm.approved_budget} onChange={e=>setBudgetForm({...budgetForm,approved_budget:e.target.value})}/>
          <input placeholder="Contingency" value={budgetForm.contingency_budget} onChange={e=>setBudgetForm({...budgetForm,contingency_budget:e.target.value})}/>
          <input placeholder="Currency" value={budgetForm.currency} onChange={e=>setBudgetForm({...budgetForm,currency:e.target.value})}/>
          <input type="date" value={budgetForm.baseline_date} onChange={e=>setBudgetForm({...budgetForm,baseline_date:e.target.value})}/>
        </div>
        <textarea placeholder="Budget notes" value={budgetForm.notes} onChange={e=>setBudgetForm({...budgetForm,notes:e.target.value})} style={{width:"100%",minHeight:70,marginTop:8}}/>
        <button onClick={saveBudget} style={{marginTop:8}}>Save Budget</button>

        <h2 style={{marginTop:24}}>Cost Entries</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input type="date" value={cost.cost_date} onChange={e=>setCost({...cost,cost_date:e.target.value})}/>
          <input placeholder="Category" value={cost.category} onChange={e=>setCost({...cost,category:e.target.value})}/>
          <select value={cost.cost_type} onChange={e=>setCost({...cost,cost_type:e.target.value})}>
            <option value="actual">Actual</option><option value="commitment">Commitment</option><option value="accrual">Accrual</option>
          </select>
          <input placeholder="Amount" value={cost.amount} onChange={e=>setCost({...cost,amount:e.target.value})}/>
          <input placeholder="Owner" value={cost.owner} onChange={e=>setCost({...cost,owner:e.target.value})}/>
          <input placeholder="Vendor" value={cost.vendor} onChange={e=>setCost({...cost,vendor:e.target.value})}/>
        </div>
        <textarea placeholder="Description" value={cost.description} onChange={e=>setCost({...cost,description:e.target.value})} style={{width:"100%",minHeight:60,marginTop:8}}/>
        <button onClick={addCost} style={{marginTop:8}}>Add Cost</button>

        {costs.slice(0,20).map(x=><div key={x.id} style={{padding:"10px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.category}</b> — {money(x.amount)}
          <div style={{color:"#667085"}}>{x.cost_date} · {x.cost_type} · {x.vendor||"No vendor"}</div>
        </div>)}
      </section>

      <section style={card}>
        <h2>Forecast</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input type="date" value={fc.forecast_date} onChange={e=>setFc({...fc,forecast_date:e.target.value})}/>
          <select value={fc.forecast_method} onChange={e=>setFc({...fc,forecast_method:e.target.value})}>
            <option value="manual">Manual</option><option value="trend">Trend-based</option><option value="bottom_up">Bottom-up</option>
          </select>
          <input placeholder="Estimate to complete (ETC)" value={fc.estimate_to_complete} onChange={e=>setFc({...fc,estimate_to_complete:e.target.value})}/>
          <input placeholder="Estimate at completion (EAC)" value={fc.estimate_at_completion} onChange={e=>setFc({...fc,estimate_at_completion:e.target.value})}/>
        </div>
        <textarea placeholder="Forecast assumptions" value={fc.assumptions} onChange={e=>setFc({...fc,assumptions:e.target.value})} style={{width:"100%",minHeight:80,marginTop:8}}/>
        <button onClick={addForecast} style={{marginTop:8}}>Add Forecast</button>

        {forecasts.slice(0,10).map(x=><div key={x.id} style={{padding:"10px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.forecast_date}</b>
          <div style={{color:"#667085"}}>ETC {money(x.estimate_to_complete)} · EAC {money(x.estimate_at_completion)} · {x.forecast_method}</div>
        </div>)}

        <div style={{marginTop:20,paddingTop:15,borderTop:"1px solid #eee"}}>
          <h3>Key Financial Signals</h3>
          <p>Budget consumed: {metrics.burn===null?"—":metrics.burn+"%"}</p>
          <p>Forecast variance: {money(metrics.variance)}</p>
          <p>Previous AI reviews: {reviews.length}</p>
        </div>
      </section>
    </div>
  </>;
}
