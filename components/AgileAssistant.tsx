'use client';
import {useState} from "react";

export default function AgileAssistant(){
  const [open,setOpen]=useState(false);
  const [question,setQuestion]=useState("");
  const [messages,setMessages]=useState<any[]>([
    {role:"assistant",text:"Hi - I’m the DeliverIQ Agile Assistant. Ask me about Scrum, Agile delivery, RAID, dependencies, metrics, ceremonies, governance, programme delivery, templates, or your current project."}
  ]);
  const [loading,setLoading]=useState(false);
  const [useWeb,setUseWeb]=useState(true);

  function projectId(){
    if(typeof window==="undefined") return null;
    const m=window.location.pathname.match(/\/projects\/([^\/]+)/);
    return m?.[1] || null;
  }

  async function ask(){
    const q=question.trim(); if(!q||loading)return;
    setMessages(m=>[...m,{role:"user",text:q}]); setQuestion(""); setLoading(true);
    try{
      const r=await fetch("/api/ai/agile-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q,projectId:projectId(),useWeb})});
      const d=await r.json();
      setMessages(m=>[...m,{role:"assistant",text:d.answer||d.error||"I couldn't answer that."}]);
    }catch(e:any){setMessages(m=>[...m,{role:"assistant",text:"The assistant could not connect. Please try again."}])}
    finally{setLoading(false)}
  }

  return <>
    <button aria-label="Open Agile Assistant" onClick={()=>setOpen(!open)} style={{position:"fixed",right:22,bottom:22,zIndex:9999,border:0,borderRadius:999,width:58,height:58,background:"#635bff",color:"white",fontSize:24,boxShadow:"0 12px 30px #10182835",cursor:"pointer"}}>✦</button>
    {open&&<div style={{position:"fixed",right:22,bottom:92,zIndex:9999,width:"min(410px,calc(100vw - 30px))",height:"min(610px,calc(100vh - 130px))",background:"white",border:"1px solid #e4e7ec",borderRadius:18,boxShadow:"0 22px 70px #10182835",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:16,background:"linear-gradient(135deg,#111827,#42307d)",color:"white"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><b>DeliverIQ Agile Assistant</b><div style={{fontSize:12,color:"#d0d5dd"}}>Agile + delivery + project intelligence</div></div><button onClick={()=>setOpen(false)} style={{background:"transparent",color:"white",border:0,fontSize:20,cursor:"pointer"}}>×</button></div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:14,background:"#f8fafc"}}>
        {messages.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}><div style={{maxWidth:"88%",padding:"10px 12px",borderRadius:13,whiteSpace:"pre-wrap",lineHeight:1.45,background:m.role==="user"?"#635bff":"white",color:m.role==="user"?"white":"#101828",border:m.role==="user"?"none":"1px solid #e4e7ec"}}>{m.text}</div></div>)}
        {loading&&<div style={{fontSize:13,color:"#667085"}}>Agile Assistant is researching…</div>}
      </div>
      <div style={{padding:12,borderTop:"1px solid #e4e7ec"}}>
        <label style={{display:"flex",gap:7,alignItems:"center",fontSize:12,color:"#667085",marginBottom:8}}><input type="checkbox" checked={useWeb} onChange={e=>setUseWeb(e.target.checked)} style={{width:"auto"}}/> Use live web search when useful</label>
        <div style={{display:"flex",gap:8}}><textarea value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask()}}} placeholder="Ask: What should a Scrum Master do when velocity drops?" style={{resize:"none",minHeight:54,flex:1,padding:9,border:"1px solid #d0d5dd",borderRadius:10}}/><button onClick={ask} disabled={loading} style={{alignSelf:"stretch",border:0,borderRadius:10,padding:"0 14px",background:"#635bff",color:"white",fontWeight:700,cursor:"pointer"}}>Ask</button></div>
        <div style={{fontSize:11,color:"#98a2b3",marginTop:6}}>Advisory guidance. Verify organisation-specific policy, contracts and regulatory requirements.</div>
      </div>
    </div>}
  </>
}
