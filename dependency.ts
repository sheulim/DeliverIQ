export function dependencyCriticality(dep:any, milestone:any|null, downstreamProject:any|null) {
  let score = 0;
  const status = String(dep.status || "").toLowerCase();

  if (["blocked","at risk","red","overdue"].includes(status)) score += 35;
  else if (["open","in progress","amber"].includes(status)) score += 15;

  if (dep.due_date) {
    const due = new Date(dep.due_date);
    const now = new Date();
    const days = Math.ceil((due.getTime()-now.getTime())/(1000*60*60*24));
    if (days < 0) score += 25;
    else if (days <= 7) score += 18;
    else if (days <= 14) score += 10;
  }

  const impact = String(dep.impact || "").toLowerCase();
  if (impact.includes("critical") || impact.includes("high")) score += 20;
  else if (impact.includes("medium")) score += 10;

  if (milestone) score += 10;
  if (downstreamProject) score += 10;

  score = Math.min(100, score);

  const label = score >= 70 ? "critical" : score >= 45 ? "high" : score >= 20 ? "medium" : "low";
  return {score,label};
}

export function simulateDate(dateString:string|null|undefined, slipDays:number) {
  if(!dateString) return null;
  const d = new Date(dateString);
  d.setDate(d.getDate()+slipDays);
  return d.toISOString();
}
