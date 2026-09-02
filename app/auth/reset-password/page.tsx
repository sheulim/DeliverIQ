'use client';
import {useState} from 'react';
import {supabase} from '@/lib/supabase/browser';
export default function ResetPassword(){
 const [password,setPassword]=useState(''); const [message,setMessage]=useState('');
 async function save(){ const {error}=await supabase.auth.updateUser({password}); setMessage(error?error.message:'Password updated. You can now continue to your workspace.'); }
 return <main style={{maxWidth:440,margin:'80px auto',padding:24}}><h1>Choose a new password</h1><input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:11,boxSizing:'border-box'}}/><button onClick={save} disabled={password.length<8} style={{marginTop:12,padding:11}}>Update password</button>{message&&<p>{message}</p>}<p><a href="/projects">Go to workspace</a></p></main>
}
