import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammeCapacity({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme)return <main style={{padding:32}}>Programme not found.</main>;

  const {data:projects=[]}=await sb.from("projects").select("id,name").eq("programme_id",id);
  const ids=projects.map((p:any)=>p.id);
  const [{data:resources=[]},{data:periods=[]}]=ids.length?await Promise.all([
    sb.from("resources").select("*").in("project_id",ids),
    sb.from("capacity_periods").select("*").in("project_id",ids).order("period_start",{ascending:false})
  ]):[{data:[]},{data:[]}];

  const names=Object.fromEntries(projects.map((p:any)=>[p.id,p.name]));

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/programmes/"+id}>← Programme</Link>
    <h1>Programme Capacity & Forecast</h1>
    <p style={{color:"#667085"}}>{programme.name} · Resource and capacity exposure across projects</p>

    <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18,marginBottom:18}}>
      <h2>Resources</h2>
      {resources.length===0?<p>No resource data found.</p>:resources.map((r:any)=><div key={r.id} style={{display:"grid",gridTemplateColumns:"1.2fr 1.2fr .8fr .8fr",gap:10,padding:"11px 0",borderBottom:"1px solid #eee"}}>
        <b>{r.name}</b><span>{names[r.project_id]}</span><span>{r.capacity_per_period??"—"}</span><span>{r.allocation_percent??100}%</span>
      </div>)}
    </section>

    <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}>
      <h2>Capacity history</h2>
      {periods.length===0?<p>No capacity periods found.</p>:periods.slice(0,30).map((p:any)=><div key={p.id} style={{padding:"11px 0",borderBottom:"1px solid #eee"}}>
        <b>{names[p.project_id]}</b> — {p.period_start} to {p.period_end} — Capacity {p.planned_capacity??"—"} / Demand {p.planned_demand??"—"} / Throughput {p.delivered_throughput??"—"} {p.unit||""}
      </div>)}
    </section>
  </main>;
}
