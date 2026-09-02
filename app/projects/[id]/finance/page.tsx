import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import FinancialIntelligence from "@/components/FinancialIntelligence";

export default async function FinancePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project)return <main style={{padding:32}}>Project not found.</main>;

  const [
    {data:budgetRows=[]},
    {data:costs=[]},
    {data:forecasts=[]},
    {data:reviews=[]}
  ]=await Promise.all([
    sb.from("project_budgets").select("*").eq("project_id",id).limit(1),
    sb.from("cost_entries").select("*").eq("project_id",id).order("cost_date",{ascending:false}),
    sb.from("financial_forecasts").select("*").eq("project_id",id).order("created_at",{ascending:false}),
    sb.from("financial_reviews").select("*").eq("project_id",id).order("created_at",{ascending:false}).limit(5)
  ]);

  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Financial & Budget Intelligence</h1>
    <p style={{color:"#667085"}}>{project.name} · Track budget, spend, forecast and financial risk.</p>
    <FinancialIntelligence
      project={project}
      initialBudget={budgetRows[0]||null}
      initialCosts={costs}
      initialForecasts={forecasts}
      reviews={reviews}
    />
  </main>;
}
