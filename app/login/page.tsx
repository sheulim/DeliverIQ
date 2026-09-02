'use client';
import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [signup,setSignup]=useState(false);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit() {
    setLoading(true); setMessage("");
    const result = signup
      ? await supabase.auth.signUp({
          email,password,
          options:{ emailRedirectTo:`${location.origin}/auth/callback?next=/projects` }
        })
      : await supabase.auth.signInWithPassword({email,password});
    setLoading(false);
    if (result.error) return setMessage(result.error.message);
    if (signup) return setMessage("Account created. Check your email if confirmation is enabled, then return to DeliverIQ.");
    location.href="/projects";
  }

  async function google() {
    setMessage("");
    const {error}=await supabase.auth.signInWithOAuth({
      provider:"google",
      options:{redirectTo:`${location.origin}/auth/callback?next=/projects`}
    });
    if(error) setMessage(error.message);
  }

  return <main style={{maxWidth:460,margin:"70px auto",padding:24}}>
    <div style={{border:"1px solid #e5e7eb",borderRadius:18,padding:28,boxShadow:"0 12px 40px rgba(15,23,42,.08)"}}>
      <h1 style={{marginTop:0}}>DeliverIQ</h1>
      <p style={{color:"#475569"}}>{signup ? "Create your project delivery workspace" : "Sign in to your project delivery workspace"}</p>
      <button onClick={google} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #cbd5e1",background:"white",fontWeight:700}}>Continue with Google</button>
      <div style={{textAlign:"center",margin:"18px 0",color:"#94a3b8"}}>or</div>
      {message && <p style={{padding:10,borderRadius:8,background:"#f8fafc"}}>{message}</p>}
      <label>Email</label>
      <input placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:"block",width:"100%",margin:"6px 0 14px",padding:11,border:"1px solid #cbd5e1",borderRadius:8,boxSizing:"border-box"}} />
      <label>Password</label>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:"block",width:"100%",margin:"6px 0 14px",padding:11,border:"1px solid #cbd5e1",borderRadius:8,boxSizing:"border-box"}} />
      <button onClick={submit} disabled={loading||!email||!password} style={{width:"100%",padding:12,borderRadius:10,border:0,background:"#111827",color:"white",fontWeight:700}}>{loading?"Please wait…":signup ? "Create account" : "Sign in"}</button>
      {!signup && <p style={{textAlign:"right",marginBottom:0}}><a href="/auth/forgot-password">Forgot password?</a></p>}
      <p style={{textAlign:"center",color:"#475569"}}>{signup?"Already have an account? ":"New to DeliverIQ? "}<button onClick={()=>{setSignup(!signup);setMessage("")}} style={{border:0,background:"transparent",color:"#4f46e5",fontWeight:700,cursor:"pointer"}}>{signup?"Sign in":"Create account"}</button></p>
    </div>
  </main>;
}
