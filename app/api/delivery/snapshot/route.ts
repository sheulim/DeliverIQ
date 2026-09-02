import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {calculateSnapshot} from "@/lib/delivery/snapshot";

export async function POST(req:NextRequest){
  try{
    const {projectId}=await req.json();
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});

    const {data:project}=await sb.from("projects").select("*").eq("id",projectId).single();
    if(!project) return NextResponse.json({error:"Project not found"},{status:404});

    const [{data:raid=[]},{data:milestones=[]},{data:dependencies=[]}]=await Promise.all([
      sb.from("raid_items").select("*").eq("project_id",projectId),
      sb.from("milestones").select("*").eq("project_id",projectId),
      sb.from("dependencies").select("*").eq("project_id",projectId)
    ]);

    const snapshot=calculateSnapshot(project,raid,milestones,dependencies);

    const {data,error}=await sb.from("delivery_snapshots").insert({
      project_id:projectId,
      user_id:user.id,
      ...snapshot
    }).select().single();

    if(error) throw error;
    return NextResponse.json(data);
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Could not create delivery snapshot."},{status:500});
  }
}
