import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammeFinance({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:programme}=await sb.from("programmes").select("*").eq("id",id).single();
  if(!programme)return <main style={{padding:32}}>Programme not found.</main>;

  const {data:projects=[]}=await sb.from("projects").select("id,name").eq("programme_id",id);
  const ids=projects.map((p:any)=>p.id);

  const [{data:budgets=[]},{data:costs=[]},{data:forecasts=[]}]=ids.length?await Promise.all([
    sb.from("project_budgets").select("*").in("project_id",ids),
    sb.from("cost_entries").select("*").in("project_id",ids),
    sb.from("financial_forecasts").select("*").in("project_id",ids)
  ]):[{data:[]},{data:[]},{data:[]}];

  const names=Object.fromEntries(projects.map((p:any)=>[p.id,p.name]));
  const totalBudget=budgets.reduce((s:any,b:any)=>s+Number(b.approved_budget||0),0);
  const totalActual=costs.filter((c:any)=>String(c.cost_type||"actual").toLowerCase()==="actual").reduce((s:any,c:any)=>s+Number(c.amount||0),0);

  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href={"/programmes/"+id}>← Programme</Link>
    <h1>Programme Financial Intelligence</h1>
    <p style={{color:"#667085"}}>{programme.name} · Budget and spend across programme projects</p>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"20px 0"}}>
      <div style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}><small>Total approved budget</small><div style={{fontSize:28,fontWeight:850}}>{totalBudget.toLocaleString()}</div></div>
      <div style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}><small>Total actual spend</small><div style={{fontSize:28,fontWeight:850}}>{totalActual.toLocaleString()}</div></div>
    </div>

    <section style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}>
      <h2>Project Financials</h2>
      {projects.map((p:any)=>{
        const b=budgets.find((x:any)=>x.project_id===p.id);
        const actual=costs.filter((x:any)=>x.project_id===p.id&&String(x.cost_type||"actual").toLowerCase()==="actual").reduce((s:any,x:any)=>s+Number(x.amount||0),0);
        const latest=[...forecasts].filter((x:any)=>x.project_id===p.id).sort((a:any,b:any)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())[0];
        return <div key={p.id} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:10,padding:"11px 0",borderBottom:"1px solid #eee"}}>
          <b>{p.name}</b><span>Budget {b?.approved_budget??"—"}</span><span>Actual {actual}</span><span>EAC {latest?.estimate_at_completion??"—"}</span>
        </div>
      })}
    </section>
  </main>;
}
