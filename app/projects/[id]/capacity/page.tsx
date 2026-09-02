import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import CapacityForecastManager from "@/components/CapacityForecastManager";

export default async function CapacityPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project)return <main style={{padding:32}}>Project not found.</main>;

  const [{data:resources=[]},{data:periods=[]},{data:forecasts=[]}]=await Promise.all([
    sb.from("resources").select("*").eq("project_id",id).order("created_at",{ascending:false}),
    sb.from("capacity_periods").select("*").eq("project_id",id).order("period_start",{ascending:false}),
    sb.from("delivery_forecasts").select("*").eq("project_id",id).order("created_at",{ascending:false}).limit(5)
  ]);

  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Resource, Capacity & Delivery Forecast</h1>
    <p style={{color:"#667085"}}>{project.name} · Assess whether available capacity supports the delivery plan.</p>
    <CapacityForecastManager project={project} initialResources={resources} initialPeriods={periods} forecasts={forecasts}/>
  </main>;
}
