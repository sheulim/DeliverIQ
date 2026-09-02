'use client';
import {useState} from 'react';
import {supabase} from '@/lib/supabase/browser';
export default function ForgotPassword(){
 const [email,setEmail]=useState(''); const [message,setMessage]=useState('');
 async function send(){
  const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/auth/reset-password`});
  setMessage(error?error.message:'Password reset email sent.');
 }
 return <main style={{maxWidth:440,margin:'80px auto',padding:24}}><h1>Reset password</h1><p>Enter your DeliverIQ account email.</p><input value={email} onChange={e=>setEmail(e.target.value)} type="email" style={{width:'100%',padding:11,boxSizing:'border-box'}}/><button onClick={send} disabled={!email} style={{marginTop:12,padding:11}}>Send reset link</button>{message&&<p>{message}</p>}<p><a href="/login">Back to sign in</a></p></main>
}
