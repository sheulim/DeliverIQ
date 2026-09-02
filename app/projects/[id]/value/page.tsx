import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import ValueRealisationManager from "@/components/ValueRealisationManager";

export default async function ValuePage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:project}=await sb.from("projects").select("*").eq("id",id).single();
  if(!project)return <main style={{padding:32}}>Project not found.</main>;

  const [{data:benefits=[]},{data:okrs=[]},{data:reviews=[]}]=await Promise.all([
    sb.from("benefits").select("*").eq("project_id",id).order("created_at",{ascending:false}),
    sb.from("okrs").select("*").eq("project_id",id).order("created_at",{ascending:false}),
    sb.from("value_reviews").select("*").eq("project_id",id).order("created_at",{ascending:false}).limit(5)
  ]);

  return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
    <Link href={"/projects/"+id}>← Project workspace</Link>
    <h1>Benefits, OKR & Value Realisation</h1>
    <p style={{color:"#667085"}}>{project.name} · Track whether delivery is producing intended business outcomes.</p>
    <ValueRealisationManager project={project} initialBenefits={benefits} initialOkrs={okrs} reviews={reviews}/>
  </main>;
}
