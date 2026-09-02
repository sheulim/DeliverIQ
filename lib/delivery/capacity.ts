export function capacityMetrics(resources:any[], periods:any[]) {
  const active = resources.filter(r => String(r.status||"").toLowerCase() === "active");
  const effectiveCapacity = active.reduce((sum,r)=>{
    const base = Number(r.capacity_per_period || 0);
    const allocation = Number(r.allocation_percent ?? 100) / 100;
    return sum + (base * allocation);
  },0);

  const recent = [...periods].sort((a,b)=>new Date(b.period_start).getTime()-new Date(a.period_start).getTime()).slice(0,6);
  const avgDemand = recent.length ? recent.reduce((s,p)=>s+Number(p.planned_demand||0),0)/recent.length : null;
  const avgThroughput = recent.length ? recent.reduce((s,p)=>s+Number(p.delivered_throughput||0),0)/recent.length : null;
  const avgPlannedCapacity = recent.length ? recent.reduce((s,p)=>s+Number(p.planned_capacity||0),0)/recent.length : null;

  const capacityGap = avgDemand === null ? null : effectiveCapacity - avgDemand;
  const demandCoverage = avgDemand && avgDemand > 0 ? Math.round((effectiveCapacity/avgDemand)*100) : null;

  return {
    active_resources: active.length,
    effective_capacity: Math.round(effectiveCapacity*100)/100,
    avg_planned_capacity: avgPlannedCapacity === null ? null : Math.round(avgPlannedCapacity*100)/100,
    avg_demand: avgDemand === null ? null : Math.round(avgDemand*100)/100,
    avg_throughput: avgThroughput === null ? null : Math.round(avgThroughput*100)/100,
    capacity_gap: capacityGap === null ? null : Math.round(capacityGap*100)/100,
    demand_coverage_percent: demandCoverage
  };
}

export function forecastConfidence(metrics:any, openRisks:number, overdueDeps:number, overdueMilestones:number){
  let score = 100;
  if(metrics.demand_coverage_percent !== null){
    if(metrics.demand_coverage_percent < 70) score -= 30;
    else if(metrics.demand_coverage_percent < 90) score -= 18;
    else if(metrics.demand_coverage_percent < 100) score -= 8;
  }
  if(metrics.avg_throughput !== null && metrics.avg_demand !== null && metrics.avg_throughput < metrics.avg_demand){
    score -= 15;
  }
  score -= Math.min(20, openRisks * 4);
  score -= Math.min(15, overdueDeps * 5);
  score -= Math.min(15, overdueMilestones * 5);
  return Math.max(0,Math.min(100,Math.round(score)));
}
