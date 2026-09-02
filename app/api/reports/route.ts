import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:NextRequest){
  try{
    const {projectId,reportType="weekly",report}=await req.json();
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});

    const {data,error}=await sb.from("status_reports").insert({
      project_id:projectId,
      user_id:user.id,
      report_type:reportType,
      reporting_period:report.reporting_period || null,
      overall_health:report.overall_health || null,
      executive_summary:report.executive_summary || null,
      report_json:report
    }).select().single();

    if(error) throw error;
    return NextResponse.json(data);
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Could not save status report."},{status:500});
  }
}
