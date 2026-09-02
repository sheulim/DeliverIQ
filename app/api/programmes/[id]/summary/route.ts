import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const sb=await createClient();

  const {data:projects=[]}=await sb.from("projects").select("*").eq("programme_id",id);
  const projectIds=projects.map((p:any)=>p.id);

  if(projectIds.length===0){
    return NextResponse.json({projects:[],raid:[],dependencies:[],milestones:[],snapshots:[]});
  }

  const [{data:raid=[]},{data:dependencies=[]},{data:milestones=[]},{data:snapshots=[]}]=await Promise.all([
    sb.from("raid_items").select("*").in("project_id",projectIds),
    sb.from("dependencies").select("*").in("project_id",projectIds),
    sb.from("milestones").select("*").in("project_id",projectIds),
    sb.from("delivery_snapshots").select("*").in("project_id",projectIds).order("created_at",{ascending:false})
  ]);

  return NextResponse.json({projects,raid,dependencies,milestones,snapshots});
}
