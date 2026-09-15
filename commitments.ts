export function commitmentMetrics(actions:any[], decisions:any[]) {
  const now = new Date();
  const open = (s?:string) => !["closed","completed","done","resolved"].includes(String(s||"").toLowerCase());

  const overdueActions = actions.filter(a => open(a.status) && a.due_date && new Date(a.due_date) < now);
  const dueSoonActions = actions.filter(a => {
    if(!open(a.status) || !a.due_date) return false;
    const d = new Date(a.due_date);
    const diff = (d.getTime()-now.getTime())/(1000*60*60*24);
    return diff >= 0 && diff <= 7;
  });
  const ageingActions = actions.filter(a => {
    if(!open(a.status)) return false;
    const created = new Date(a.created_at);
    return (now.getTime()-created.getTime())/(1000*60*60*24) >= 7;
  });
  const pendingDecisions = decisions.filter(d => !["made","closed","approved","rejected"].includes(String(d.status||"").toLowerCase()));

  return {
    open_actions: actions.filter(a=>open(a.status)).length,
    overdue_actions: overdueActions.length,
    due_soon_actions: dueSoonActions.length,
    ageing_actions: ageingActions.length,
    pending_decisions: pendingDecisions.length
  };
}
