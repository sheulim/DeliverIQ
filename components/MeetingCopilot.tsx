'use client';
import {useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function MeetingCopilot({project}:{project:any}){
  const [meetingType,setMeetingType]=useState("weekly_delivery_review");
  const [title,setTitle]=useState("Weekly Delivery Review");
  const [meetingDate,setMeetingDate]=useState("");
  const [attendees,setAttendees]=useState("");
  const [notes,setNotes]=useState("");
  const [minutes,setMinutes]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  const card={background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18};

  async function generate(){
    setLoading(true);setMessage("");setMinutes(null);
    try{
      const r=await fetch("/api/ai/meeting-minutes",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          projectId:project.id,meetingType,title,meetingDate,
          attendees:attendees.split(",").map(x=>x.trim()).filter(Boolean),
          notes
        })
      });
      const d=await r.json();
      if(!r.ok)throw Error(d.error||"Generation failed.");
      setMinutes(d);
    }catch(e:any){setMessage(e.message)}finally{setLoading(false)}
  }

  async function saveMeeting(){
    if(!minutes)return;
    const r=await fetch("/api/meetings",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        projectId:project.id,programmeId:project.programme_id,
        meetingType,title,meetingDate,
        attendees:attendees.split(",").map(x=>x.trim()).filter(Boolean),
        rawNotes:notes,minutes
      })
    });
    const d=await r.json();
    if(!r.ok)setMessage(d.error||"Could not save meeting.");
    else setMessage("Meeting saved.");
  }

  async function createAction(x:any){
    const {error}=await supabase.from("actions").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      source_type:"meeting",title:x.title,description:x.description||null,
      owner:x.owner||null,due_date:x.due_date||null,priority:x.priority||"medium",status:"open"
    });
    setMessage(error?error.message:"Action added to project register.");
  }

  async function createDecision(x:any){
    const {error}=await supabase.from("decisions").insert({
      project_id:project.id,programme_id:project.programme_id||null,
      title:x.title,context:x.context||null,decision:x.decision||null,
      rationale:x.rationale||null,owner_or_forum:x.owner_or_forum||null,
      due_date:x.due_date||null,impact:x.impact||null,
      status:x.decision?"made":"pending",
      decision_date:x.decision?new Date().toISOString().slice(0,10):null
    });
    setMessage(error?error.message:"Decision added to project register.");
  }

  return <section>
    <div style={card}>
      <h2>Capture Meeting</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <label>Meeting type
          <select value={meetingType} onChange={e=>setMeetingType(e.target.value)} style={{display:"block",width:"100%",padding:9,marginTop:5}}>
            <option value="steering_committee">Steering Committee</option>
            <option value="raid_review">RAID Review</option>
            <option value="weekly_delivery_review">Weekly Delivery Review</option>
            <option value="standup">Stand-up</option>
            <option value="programme_review">Programme Review</option>
            <option value="risk_review">Risk Review</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label>Meeting date
          <input type="datetime-local" value={meetingDate} onChange={e=>setMeetingDate(e.target.value)} style={{display:"block",width:"100%",padding:9,marginTop:5}}/>
        </label>
      </div>

      <label style={{display:"block",marginTop:10}}>Title
        <input value={title} onChange={e=>setTitle(e.target.value)} style={{display:"block",width:"100%",padding:9,marginTop:5}}/>
      </label>

      <label style={{display:"block",marginTop:10}}>Attendees (comma-separated)
        <input value={attendees} onChange={e=>setAttendees(e.target.value)} style={{display:"block",width:"100%",padding:9,marginTop:5}}/>
      </label>

      <label style={{display:"block",marginTop:10}}>Raw notes
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{display:"block",width:"100%",minHeight:220,padding:11,marginTop:5}} placeholder="Paste meeting notes, transcript excerpts, or your own notes here."/>
      </label>

      <button onClick={generate} disabled={!notes.trim()||loading} style={{marginTop:12,padding:"11px 16px",border:0,borderRadius:9,background:"#635bff",color:"#fff",fontWeight:750}}>
        {loading?"Generating minutes…":"Generate Minutes & Follow-ups ✨"}
      </button>
      {message&&<p>{message}</p>}
    </div>

    {minutes&&<div style={{display:"grid",gap:14,marginTop:18}}>
      <section style={card}>
        <h2>Meeting summary</h2>
        <p>{minutes.meeting_summary}</p>
        <h3>Executive takeaways</h3>
        <ul>{(minutes.executive_takeaways||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
        <small>{minutes.confidence_note}</small>
      </section>

      <section style={card}>
        <h3>Key discussion points</h3>
        <ul>{(minutes.key_discussion_points||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      </section>

      <section style={card}>
        <h3>Actions extracted</h3>
        {(minutes.actions||[]).map((x:any,i:number)=><div key={i} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.title}</b>
          <div>{x.description}</div>
          <small>Owner: {x.owner||"Not stated"} · Due: {x.due_date||"Not stated"} · Priority: {x.priority||"medium"}</small><br/>
          <button onClick={()=>createAction(x)} style={{marginTop:6}}>Add to Action Register</button>
        </div>)}
      </section>

      <section style={card}>
        <h3>Decisions extracted</h3>
        {(minutes.decisions||[]).map((x:any,i:number)=><div key={i} style={{padding:"12px 0",borderBottom:"1px solid #eee"}}>
          <b>{x.title}</b>
          <div>{x.decision||x.context}</div>
          <small>Owner / forum: {x.owner_or_forum||"Not stated"}</small><br/>
          <button onClick={()=>createDecision(x)} style={{marginTop:6}}>Add to Decision Register</button>
        </div>)}
      </section>

      <section style={card}>
        <h3>Risks or issues raised</h3>
        <ul>{(minutes.risks_or_issues_raised||[]).map((x:any,i:number)=><li key={i}><b>{x.type}: {x.title}</b> — {x.description}</li>)}</ul>
      </section>

      <section style={card}>
        <h3>What changed from this meeting?</h3>
        <ul>{(minutes.what_changed||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      </section>

      <section style={card}>
        <h3>Follow-up questions</h3>
        <ul>{(minutes.follow_up_questions||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
      </section>

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={saveMeeting} style={{padding:"11px 16px",border:"1px solid #d8dbe6",borderRadius:9,background:"#fff",fontWeight:750}}>
          Save Reviewed Meeting
        </button>
      </div>
    </div>}
  </section>;
}
