'use client';
import {useState} from "react";
const labs=[
 ["Governance Agent","Generate a weekly governance pack from RAID, milestones, dependencies and decisions."],
 ["Meeting-to-Execution Agent","Convert transcript text into summary, actions, decisions and risks."],
 ["Delivery Digital Twin","Simulate a dependency slip, scope increase, budget pressure or capacity loss."],
 ["Benefits Evidence Agent","Check whether benefits have measurable evidence and identify missing proof."],
 ["Portfolio Rebalancing Copilot","Compare initiatives using strategic value, delivery confidence and capacity."]
];
export default function Page(){const [out,setOut]=useState("");function run(name:string){const samples:any={
"Governance Agent":"Governance pack prepared: Overall AMBER. Top concerns: UAT reconciliation, one critical dependency, forecast overspend. Decisions required: scope/date contingency and cutover readiness threshold.",
"Meeting-to-Execution Agent":"Extracted: 2 actions, 1 decision, 1 issue and 1 follow-up. Human review required before saving.",
"Delivery Digital Twin":"Scenario: 14-day dependency slip. Likely impact: cutover rehearsal compression, reduced schedule contingency and higher resource overlap. Confidence: Medium.",
"Benefits Evidence Agent":"3 of 5 benefits have current evidence. Two benefits require KPI owner/source confirmation.",
"Portfolio Rebalancing Copilot":"Suggested review: protect Initiative A, challenge Initiative B scope, and defer Initiative C pending capacity recovery. Advisory only."
};setOut(samples[name])}return <main style={{padding:32,maxWidth:1100,margin:"0 auto"}}><h1>DeliverIQ AI Lab</h1><p>Usable prototypes of future automation ideas. All outputs remain advisory and require human approval.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>{labs.map(([n,d])=><article key={n} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}><h2>{n}</h2><p>{d}</p><button onClick={()=>run(n)}>Run demo ✨</button></article>)}</div>{out&&<div style={{marginTop:20,background:"#111827",color:"#fff",borderRadius:14,padding:20}}><h2>AI Result</h2><p>{out}</p><small>Evidence-based prototype output · Human review required</small></div>}</main>}
