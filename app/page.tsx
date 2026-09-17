import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Home(){
 const featureGroups=[
  ["Plan","AI project wizard, charter, milestones, requirements, scope and change control"],
  ["Govern","RAID, dependencies, actions, decisions, meetings, stakeholders and communications"],
  ["Predict","Delivery confidence, impact simulation, capacity forecast and financial intelligence"],
  ["Deliver Value","Benefits, OKRs, programme intelligence, portfolio thinking and executive reporting"]
 ];
 return <main style={{fontFamily:"Arial, sans-serif",background:"#f8fafc",minHeight:"100vh",color:"#101828"}}>
  <section style={{padding:"72px 32px",maxWidth:1200,margin:"0 auto"}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"center",flexWrap:"wrap"}}>
    <strong style={{fontSize:22}}>DeliverIQ</strong>
    <nav style={{display:"flex",gap:16,flexWrap:"wrap"}}>
     <Link href="/playbooks">Playbooks</Link><Link href="/templates">Templates</Link><Link href="/learning-lab" style={{fontWeight:700}}>Learning Lab</Link><Link href="/learn">Learning</Link><Link href="/ai-future">AI Future</Link><Link href="/login">Sign in</Link>
    </nav>
   </div>
   <div style={{padding:"70px 0 40px"}}>
    <p style={{fontWeight:700,color:"#635bff"}}>THE INTELLIGENCE LAYER FOR PROJECT DELIVERY</p>
    <h1 style={{fontSize:"clamp(42px,7vw,76px)",lineHeight:1.02,maxWidth:900,margin:"10px 0"}}>Plan. Govern. Predict. Deliver.</h1>
    <p style={{fontSize:21,maxWidth:760,color:"#475467"}}>An AI-powered command centre for Project Managers, Delivery Managers, Scrum Masters, Program Managers and Portfolio Managers.</p>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:24}}>
     <Link href="/login" style={{padding:"13px 18px",background:"#635bff",color:"#fff",borderRadius:10,textDecoration:"none"}}>Create a project with AI</Link>
     <Link href="/learning-lab" style={{padding:"13px 18px",background:"#fff",border:"1px solid #635bff",color:"#4f46e5",borderRadius:10,textDecoration:"none",fontWeight:700}}>Start Learning by Doing</Link>
     <Link href="/playbooks" style={{padding:"13px 18px",background:"#fff",border:"1px solid #d0d5dd",borderRadius:10,textDecoration:"none"}}>Explore playbooks</Link>
    </div>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
    {featureGroups.map(([t,d])=><article key={t} style={{background:"#fff",border:"1px solid #eaecf0",borderRadius:16,padding:20}}><h2>{t}</h2><p style={{color:"#667085"}}>{d}</p></article>)}
   </div>
  </section>

  <section style={{padding:"58px 32px",background:"#111827",color:"#fff"}}>
   <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:28,alignItems:"center"}}>
    <div>
     <p style={{fontWeight:800,color:"#c4b5fd",letterSpacing:1}}>PROJECT LEARNING LAB</p>
     <h2 style={{fontSize:38,margin:"8px 0 12px"}}>Learn by delivering a real project.</h2>
     <p style={{fontSize:19,lineHeight:1.6,color:"#d1d5db"}}>Move beyond passive courses. Learn a delivery concept, apply it to a project, submit evidence, review the result and improve the next challenge.</p>
     <Link href="/learning-lab" style={{display:"inline-block",marginTop:18,padding:"13px 18px",background:"#fff",color:"#111827",borderRadius:10,textDecoration:"none",fontWeight:800}}>Open Project Learning Lab →</Link>
    </div>
    <div style={{background:"#1f2937",border:"1px solid #374151",borderRadius:18,padding:24}}>
     <div style={{fontWeight:800,fontSize:20,marginBottom:16}}>LEARN → PRACTICE → DELIVER → PROVE</div>
     <p style={{color:"#d1d5db",lineHeight:1.6}}>Build practical evidence through project outcomes, milestone plans, RAID and decision logs, delivery metrics and retrospectives—with AI-assisted feedback and human review.</p>
    </div>
   </div>
  </section>

  <section style={{padding:"54px 32px",background:"#fff"}}>
   <div style={{maxWidth:1200,margin:"0 auto"}}>
    <h2 style={{fontSize:36}}>Built for the way delivery leaders actually work</h2>
    <p style={{fontSize:18,color:"#667085"}}>Move from templates to structured project data to AI-assisted decisions—without replacing Jira, Azure DevOps or the tools teams already use.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:22}}>
     {["Scrum Master","Delivery Manager","Project Manager","Program Manager","Portfolio Manager"].map(x=><Link key={x} href="/playbooks" style={{padding:18,border:"1px solid #eaecf0",borderRadius:14,textDecoration:"none",fontWeight:700}}>{x} Playbook →</Link>)}
    </div>
   </div>
  </section>

  <section style={{padding:"54px 32px"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
   <h2 style={{fontSize:36}}>Open PM Toolkit</h2>
   <p style={{fontSize:18,color:"#667085"}}>Download and remix premium-quality DeliverIQ templates under CC BY 4.0.</p>
   <Link href="/templates">Browse the open template library →</Link>
  </div></section>

  <section style={{padding:"54px 32px",background:"#fff"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
   <h2 style={{fontSize:36}}>AI that reduces PM admin, not PM accountability</h2>
   <p style={{fontSize:18,color:"#667085"}}>DeliverIQ’s roadmap includes meeting-to-execution automation, digital-twin simulations, continuous dependency intelligence, benefits evidence, portfolio rebalancing and policy-aware governance.</p>
   <Link href="/ai-future">See the AI automation roadmap →</Link>
  </div></section>

  <section style={{padding:"54px 32px"}}><div style={{maxWidth:1200,margin:"0 auto"}}><NewsletterSignup/></div></section>
 </main>
}
