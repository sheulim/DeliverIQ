export function progressPercent(baseline:any,target:any,actual:any){
  const b=Number(baseline), t=Number(target), a=Number(actual);
  if([b,t,a].some(Number.isNaN) || t===b) return null;
  const pct=((a-b)/(t-b))*100;
  return Math.max(0,Math.min(100,Math.round(pct)));
}

export function aggregateValueScore(benefits:any[],okrs:any[]){
  const values:number[]=[];
  for(const b of benefits){
    const p=progressPercent(b.baseline_value,b.target_value,b.actual_value);
    if(p!==null) values.push(p);
  }
  for(const o of okrs){
    const p=progressPercent(o.baseline_value,o.target_value,o.actual_value);
    if(p!==null) values.push(p);
  }
  if(!values.length) return null;
  return Math.round(values.reduce((a,b)=>a+b,0)/values.length);
}
