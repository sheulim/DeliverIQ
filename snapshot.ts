export function calculateSnapshot(project:any, raid:any[], milestones:any[], dependencies:any[]) {
  const now = new Date();
  const daysOld = (dateString?:string|null) => {
    if(!dateString) return 0;
    const d = new Date(dateString);
    return Math.floor((now.getTime()-d.getTime())/(1000*60*60*24));
  };

  const open = (status?:string) => !["closed","resolved","complete","completed"].includes(String(status||"").toLowerCase());

  const openRisks = raid.filter(x=>x.item_type==="risk" && open(x.status));
  const openIssues = raid.filter(x=>x.item_type==="issue" && open(x.status));
  const openDecisions = raid.filter(x=>x.item_type==="decision" && open(x.status));
  const highRisks = openRisks.filter(x=>Number(x.score||0) >= 15);

  const ageingRaid = raid.filter(x=>open(x.status) && daysOld(x.updated_at || x.created_at) >= 7).length;

  const overdueDependencies = dependencies.filter(x=>{
    if(!open(x.status) || !x.due_date) return false;
    return new Date(x.due_date) < now;
  });

  const overdueMilestones = milestones.filter(x=>{
    if(!open(x.status) || !x.target_date) return false;
    return new Date(x.target_date) < now;
  });

  const upcomingMilestones = milestones.filter(x=>{
    if(!open(x.status) || !x.target_date) return false;
    const d = new Date(x.target_date);
    const diff = (d.getTime()-now.getTime())/(1000*60*60*24);
    return diff >= 0 && diff <= 30;
  });

  // Advisory heuristic, not a forecast.
  let confidence = 100;
  confidence -= Math.min(highRisks.length * 8, 32);
  confidence -= Math.min(openIssues.length * 6, 24);
  confidence -= Math.min(overdueDependencies.length * 8, 24);
  confidence -= Math.min(overdueMilestones.length * 10, 30);
  confidence -= Math.min(ageingRaid * 2, 14);
  confidence = Math.max(0, Math.min(100, confidence));

  return {
    open_risks: openRisks.length,
    high_risks: highRisks.length,
    open_issues: openIssues.length,
    open_decisions: openDecisions.length,
    open_dependencies: dependencies.filter(x=>open(x.status)).length,
    overdue_dependencies: overdueDependencies.length,
    upcoming_milestones: upcomingMilestones.length,
    overdue_milestones: overdueMilestones.length,
    ageing_raid: ageingRaid,
    delivery_confidence: confidence,
    snapshot_json: {
      project_health: project.health,
      generated_at: now.toISOString()
    }
  };
}
