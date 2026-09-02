'use client';
import {useState} from "react";
export default function NewsletterSignup(){
 const [email,setEmail]=useState("");const [msg,setMsg]=useState("");const [loading,setLoading]=useState(false);
 async function subscribe(){setLoading(true);const r=await fetch("/api/newsletter/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});const d=await r.json();setMsg(d.message||d.error);setLoading(false)}
 return <section style={{padding:24,borderRadius:16,background:"#111827",color:"#fff"}}>
  <h2>DeliverIQ Weekly Delivery Insights</h2>
  <p>One practical email each week: delivery signals, AI-in-PM ideas, templates, governance tips and useful learning links.</p>
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{padding:11,minWidth:260,borderRadius:8,border:"1px solid #d0d5dd"}}/><button onClick={subscribe} disabled={loading} style={{padding:"11px 16px",borderRadius:8}}>{loading?"Subscribing…":"Subscribe"}</button></div>
  {msg&&<p>{msg}</p>}
 </section>
}
