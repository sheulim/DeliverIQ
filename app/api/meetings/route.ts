import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:NextRequest){
  try{
    const {projectId,programmeId,meetingType,title,meetingDate,attendees,rawNotes,minutes}=await req.json();
    const sb=await createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});

    const {data,error}=await sb.from("meetings").insert({
      project_id:projectId,
      programme_id:programmeId||null,
      user_id:user.id,
      meeting_type:meetingType,
      title,
      meeting_date:meetingDate||null,
      attendees:attendees||[],
      raw_notes:rawNotes||null,
      minutes_json:minutes
    }).select().single();

    if(error)throw error;
    return NextResponse.json(data);
  }catch(error){
    console.error(error);
    return NextResponse.json({error:"Could not save meeting."},{status:500});
  }
}
