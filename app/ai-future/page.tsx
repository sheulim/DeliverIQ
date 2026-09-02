import Link from "next/link";
export default function Page(){
 const ideas=[
  ["Autonomous Governance Assistant","Prepares weekly status, flags stale RAID, drafts SteerCo packs and suggests decisions—always requiring human approval."],
  ["Meeting-to-Execution Agent","Converts transcripts into structured actions, decisions, risks and dependencies, then tracks closure."],
  ["Delivery Digital Twin","Models project state across scope, schedule, cost, capacity, risk and value to simulate likely impact of changes."],
  ["Continuous Dependency Watch","Detects cross-team slippage and propagates impact signals across projects and programmes."],
  ["Benefits Evidence Agent","Pulls KPI evidence from approved data sources and highlights where claimed benefits lack measurable proof."],
  ["Portfolio Rebalancing Copilot","Suggests stop/start/continue funding choices based on strategic value, capacity constraints, delivery confidence and benefits."],
  ["Predictive Capacity Assistant","Combines throughput, staffing, leave, demand and dependency load to identify future bottlenecks."],
  ["Policy-Aware PM Copilot","Applies organisation-specific governance, risk, compliance and approval rules automatically."],
  ["Executive Narrative Generator","Turns structured delivery data into concise audience-specific narratives without inventing progress."],
  ["Project Memory Graph","Builds a traceable knowledge graph linking decisions, meetings, requirements, changes, risks and outcomes."]
 ];
 return <main style={{padding:32,maxWidth:1100,margin:"0 auto"}}><Link href="/">← Home</Link><h1>The Future of AI in Project Management</h1><p>DeliverIQ should automate administrative work while keeping accountability, judgment and approvals with people.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>{ideas.map(([t,d])=><article key={t} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}><h2 style={{fontSize:20}}>{t}</h2><p>{d}</p></article>)}</div></main>
}
