export type MetricPoint={name:string,current:number|null,previous:number|null};
export function analyseMetricRelationships(points:MetricPoint[]){
 const m=Object.fromEntries(points.map(x=>[x.name,x]));
 const up=(n:string)=>m[n]?.current!=null&&m[n]?.previous!=null&&m[n].current >m[n].previous;
 const down=(n:string)=>m[n]?.current!=null&&m[n]?.previous!=null&&m[n].current <m[n].previous;
 const out:any[]=[];
 if(up("Work in Progress")&&up("Cycle Time"))out.push({signal:"Flow congestion",evidence:["WIP ↑","Cycle Time ↑"],action:"Inspect queues, blockers and WIP limits."});
 if(up("Velocity")&&up("Escaped Defects"))out.push({signal:"Possible quality trade-off",evidence:["Velocity ↑","Escaped defects ↑"],action:"Review quality gates and Definition of Done; do not reward velocity alone."});
 if(up("Blocker Age")&&down("Dependency On-time %"))out.push({signal:"Dependency pressure",evidence:["Blocker age ↑","Dependency reliability ↓"],action:"Escalate aged blockers and reconfirm provider commitments."});
 if(up("Budget Consumed %")&&down("Benefit Realisation %"))out.push({signal:"Cost/value divergence",evidence:["Budget consumption ↑","Benefit realisation ↓"],action:"Validate benefit evidence and the remaining investment case."});
 return out;
}
