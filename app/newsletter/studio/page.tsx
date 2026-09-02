'use client';
import {useState} from 'react';
export default function NewsletterStudio(){
 const [title,setTitle]=useState(''); const [body,setBody]=useState('');
 return <main style={{maxWidth:900,margin:'40px auto',padding:24}}><h1>Newsletter Studio</h1><p>Draft → AI Assist → Preview → Publish → Send → Archive. Publishing and sending remain separate approval actions.</p><label>Issue title</label><input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:10,margin:'6px 0 16px',boxSizing:'border-box'}}/><label>Content</label><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write or paste this week's newsletter…" style={{width:'100%',minHeight:320,padding:12,boxSizing:'border-box'}}/><div style={{display:'flex',gap:10,marginTop:14}}><button disabled>Save Draft (after DB migration)</button><button disabled>Ask DeliverIQ AI</button><button disabled>Publish</button><button disabled>Send to Subscribers</button></div><p style={{color:'#64748b'}}>These actions are intentionally disabled in this build until newsletter tables and admin permissions are activated in Supabase.</p></main>
}
