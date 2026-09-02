'use client';
import {useMemo,useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function StakeholderCommunications({project,initialStakeholders,initialCommunications}:{project:any,initialStakeholders:any[],initialCommunications:any[]}){
  const [stakeholders,setStakeholders]=useState(initialStakeholders);
  const [communications,setCommunications]=useState(initialCommunications);
  const [selected,setSelected]=useState<any>(initialStakeholders[0]||null);
  const [generated,setGenerated]=useState<any>(null);
  const [audienceType,setAudienceType]=useState("executive");
  const [communicationType,setCommunicationType]=useState("status_update");
  const [purpose,setPurpose]=useState("");
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  const [form,setForm]=useState({
    name:"",role:"",organisation:"",stakeholder_type:"internal",
    influence:"medium",interest:"medium",sentiment:"neutral",
    preferred_channel:"email",communication_frequency:"weekly",
    key_needs:"",engagement_strategy:"",owner:""
  });

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  const matrix=useMemo(()=>({
    manageClosely:stakeholders.filter(s=>s.influence==="high"&&s.interest==="high").length,
    keepSatisfied:stakeholders.filter(s=>s.influence==="high"&&s.interest!=="high").length,
    keepInformed:stakeholders.filter(s=>s.influence!=="high"&&s.interest==="high").length,
    monitor:stakeholders.filter(s=>s.influence!=="high"&&s.interest!=="high").length
  }),[stakeholders]);

  async function addStakeholder(){
    if(!form.name.trim())return;
    const {data,error}=await supabase.from("stakeholders").insert({
      project_id:project.id,programme_id:project.programme_id||null,...form
    }).select().single();
    if(error)return setMessage(error.message);
    setStakeholders([data,...stakeholders]);
    setSelected(data);
    setForm({
      name:"",role:"",organisation:"",stakeholder_type:"internal",
      influence:"medium",interest:"medium",sentiment:"neutral",
      preferred_channel:"email",communication_frequency:"weekly",
      key_needs:"",engagement_strategy:"",owner:""
    });
  }

  async function generate(){
    setLoading(true);setMessage("");setGenerated(null);
    try{
      const r=await fetch("/api/ai/stakeholder-update",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          projectId:project.id,stakeholderId:selected?.id||null,
          audienceType,communicationType,purpose
        })
      });
      const d=await r.json();
      if(!r.ok)throw Error(d.error||"Generation failed.");
      setGenerated(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  async function saveCommunication(){
    if(!generated)return;
    const {data,error}=await supabase.from("communications").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      stakeholder_id:selected?.id||null,audience_type:audienceType,
      communication_type:communicationType,subject:generated.subject,
      body:generated.body,status:"draft",
      source_context:{purpose,stakeholder:selected?.name||null}
    }).select().single();
    if(error)return setMessage(error.message);
    setCommunications([data,...communications]);
    setMessage("Communication saved as draft.");
  }

  return <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,margin:"20px 0"}}>
      <div style={card}><small>Manage closely</small><div style={{fontSize:30,fontWeight:850}}>{matrix.manageClosely}</div></div>
      <div style={card}><small>Keep satisfied</small><div style={{fontSize:30,fontWeight:850}}>{matrix.keepSatisfied}</div></div>
      <div style={card}><small>Keep informed</small><div style={{fontSize:30,fontWeight:850}}>{matrix.keepInformed}</div></div>
      <div style={card}><small>Monitor</small><div style={{fontSize:30,fontWeight:850}}>{matrix.monitor}</div></div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <section style={card}>
        <h2>Stakeholder Register</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input placeholder="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/>
          <input placeholder="Organisation" value={form.organisation} onChange={e=>setForm({...form,organisation:e.target.value})}/>
          <input placeholder="Owner" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/>
          <select value={form.influence} onChange={e=>setForm({...form,influence:e.target.value})}>
            <option value="low">Low influence</option><option value="medium">Medium influence</option><option value="high">High influence</option>
          </select>
          <select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}>
            <option value="low">Low interest</option><option value="medium">Medium interest</option><option value="high">High interest</option>
          </select>
          <select value={form.sentiment} onChange={e=>setForm({...form,sentiment:e.target.value})}>
            <option value="supportive">Supportive</option><option value="neutral">Neutral</option><option value="concerned">Concerned</option><option value="resistant">Resistant</option>
          </select>
          <select value={form.preferred_channel} onChange={e=>setForm({...form,preferred_channel:e.target.value})}>
            <option value="email">Email</option><option value="meeting">Meeting</option><option value="chat">Chat</option><option value="dashboard">Dashboard</option>
          </select>
        </div>
        <textarea placeholder="Key needs / concerns" value={form.key_needs} onChange={e=>setForm({...form,key_needs:e.target.value})} style={{width:"100%",minHeight:70,marginTop:8}}/>
        <textarea placeholder="Engagement strategy" value={form.engagement_strategy} onChange={e=>setForm({...form,engagement_strategy:e.target.value})} style={{width:"100%",minHeight:70,marginTop:8}}/>
        <button onClick={addStakeholder} style={{marginTop:8}}>Add Stakeholder</button>

        <div style={{marginTop:18}}>
          {stakeholders.map(s=><button key={s.id} onClick={()=>setSelected(s)} style={{
            display:"block",width:"100%",textAlign:"left",padding:12,margin:"7px 0",
            background:"#fff",border:selected?.id===s.id?"2px solid #635bff":"1px solid #e6e8ef",borderRadius:10
          }}>
            <b>{s.name}</b>
            <div style={{color:"#667085"}}>{s.role||"Role not set"} · Influence {s.influence} · Interest {s.interest} · {s.sentiment}</div>
          </button>)}
        </div>
      </section>

      <section style={card}>
        <h2>Communication Copilot</h2>
        <p style={{color:"#667085"}}>{selected?`Tailor an update for ${selected.name}.`:"Generate an audience-based project update."}</p>

        <label>Audience
          <select value={audienceType} onChange={e=>setAudienceType(e.target.value)} style={{display:"block",width:"100%",padding:9,margin:"5px 0 10px"}}>
            <option value="executive">Executive</option>
            <option value="business">Business stakeholder</option>
            <option value="delivery_team">Delivery team</option>
            <option value="vendor">Vendor / partner</option>
            <option value="steering_committee">Steering committee</option>
          </select>
        </label>

        <label>Communication type
          <select value={communicationType} onChange={e=>setCommunicationType(e.target.value)} style={{display:"block",width:"100%",padding:9,margin:"5px 0 10px"}}>
            <option value="status_update">Status update</option>
            <option value="escalation">Escalation</option>
            <option value="decision_request">Decision request</option>
            <option value="milestone_update">Milestone update</option>
            <option value="risk_update">Risk update</option>
          </select>
        </label>

        <textarea placeholder="Purpose / emphasis" value={purpose} onChange={e=>setPurpose(e.target.value)} style={{width:"100%",minHeight:90}}/>

        <button onClick={generate} disabled={loading} style={{marginTop:10,padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
          {loading?"Drafting communication…":"Generate Stakeholder Update ✨"}
        </button>
        {message&&<p>{message}</p>}

        {generated&&<div style={{marginTop:18}}>
          <h3>{generated.subject}</h3>
          <p><b>Tone:</b> {generated.tone}</p>
          <div style={{whiteSpace:"pre-wrap",lineHeight:1.55,border:"1px solid #eee",borderRadius:10,padding:14}}>{generated.body}</div>

          <h4>Decisions / asks</h4>
          <ul>{(generated.decisions_or_asks||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
          <h4>Risks / concerns</h4>
          <ul>{(generated.risks_or_concerns||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
          <small>{generated.confidence_note}</small><br/>
          <button onClick={saveCommunication} style={{marginTop:10}}>Save as Draft</button>
        </div>}
      </section>
    </div>

    <section style={{...card,marginTop:18}}>
      <h2>Communication History</h2>
      {communications.length===0?<p>No saved communications yet.</p>:communications.map(c=><div key={c.id} style={{padding:"11px 0",borderBottom:"1px solid #eee"}}>
        <b>{c.subject||"Untitled communication"}</b>
        <div style={{color:"#667085"}}>{c.audience_type||"Audience"} · {c.communication_type||"Update"} · {c.status}</div>
        <p style={{marginBottom:0}}>{String(c.body).slice(0,240)}{String(c.body).length>240?"…":""}</p>
      </div>)}
    </section>
  </>;
}
