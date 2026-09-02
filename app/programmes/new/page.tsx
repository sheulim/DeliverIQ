'use client';
import {useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function NewProgramme(){
  const [name,setName]=useState("");
  const [description,setDescription]=useState("");
  const [owner,setOwner]=useState("");
  const [error,setError]=useState("");

  async function createProgramme(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return setError("Please sign in.");
    const {data,error}=await supabase.from("programmes").insert({
      user_id:user.id,name,description:description||null,owner:owner||null,status:"active",health:"green"
    }).select().single();
    if(error) return setError(error.message);
    location.href="/programmes/"+data.id;
  }

  return <main style={{maxWidth:680,margin:"50px auto",padding:20}}>
    <h1>Create Programme</h1>
    <p style={{color:"#667085"}}>Create a programme and assign existing DeliverIQ projects to it.</p>
    {error&&<p style={{color:"#b42318"}}>{error}</p>}
    <input placeholder="Programme name" value={name} onChange={e=>setName(e.target.value)} style={{display:"block",width:"100%",padding:11,margin:"10px 0"}}/>
    <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{display:"block",width:"100%",padding:11,margin:"10px 0",minHeight:110}}/>
    <input placeholder="Programme owner" value={owner} onChange={e=>setOwner(e.target.value)} style={{display:"block",width:"100%",padding:11,margin:"10px 0"}}/>
    <button onClick={createProgramme} disabled={!name.trim()}>Create Programme</button>
  </main>;
}
