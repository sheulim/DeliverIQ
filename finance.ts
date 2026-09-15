export function financialMetrics(budget:any, costs:any[], forecasts:any[]) {
  const approved = Number(budget?.approved_budget || 0);
  const contingency = Number(budget?.contingency_budget || 0);

  const actual = costs
    .filter(c => String(c.cost_type||"actual").toLowerCase() === "actual")
    .reduce((s,c)=>s+Number(c.amount||0),0);

  const commitments = costs
    .filter(c => ["commitment","accrual"].includes(String(c.cost_type||"").toLowerCase()))
    .reduce((s,c)=>s+Number(c.amount||0),0);

  const latestForecast = [...forecasts].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())[0] || null;
  const etc = latestForecast?.estimate_to_complete != null ? Number(latestForecast.estimate_to_complete) : null;
  const eac = latestForecast?.estimate_at_completion != null
    ? Number(latestForecast.estimate_at_completion)
    : (etc != null ? actual + etc : actual + commitments);

  const variance = approved ? approved - eac : null;
  const variancePct = approved ? Math.round(((approved-eac)/approved)*10000)/100 : null;
  const burnPct = approved ? Math.round((actual/approved)*10000)/100 : null;

  return {
    approved_budget: approved,
    contingency_budget: contingency,
    actual_spend: actual,
    commitments,
    etc,
    eac,
    variance,
    variance_percent: variancePct,
    budget_consumed_percent: burnPct
  };
}

export function financialHealth(metrics:any){
  if(!metrics.approved_budget) return "UNKNOWN";
  if(metrics.variance_percent == null) return "UNKNOWN";
  if(metrics.variance_percent < -10) return "RED";
  if(metrics.variance_percent < 0) return "AMBER";
  return "GREEN";
}
