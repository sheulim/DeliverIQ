import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:NextRequest){
 try{
  const {email,name}=await req.json();
  const normalized=String(email||"").trim().toLowerCase();
  if(!normalized || !normalized.includes("@")) return NextResponse.json({error:"Valid email required."},{status:400});
  const sb=await createClient();
  const {error}=await sb.from("newsletter_subscribers").insert({email:normalized,name:name||null,status:"subscribed",source:"website"});
  if(error && error.code!=="23505") throw error;
  return NextResponse.json({ok:true,message:error?.code==="23505"?"You're already subscribed to DeliverIQ Weekly Delivery Insights.":"You're subscribed to DeliverIQ Weekly Delivery Insights."});
 }catch(e){console.error(e);return NextResponse.json({error:"Subscription failed. Please try again."},{status:500})}
}
