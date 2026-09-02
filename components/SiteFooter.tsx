export default function SiteFooter(){
 const social=[
  {label:"LinkedIn",href:"https://www.linkedin.com/in/sheulimukhopadhyay/",icon:"in",desc:"Connect with Sheuli"},
  {label:"YouTube",href:"https://www.youtube.com/@SheuliMukherjee444",icon:"▶",desc:"Watch delivery & AI content"},
  {label:"Discussion over Chai",href:"https://www.chai4.me/sheuli",icon:"☕",desc:"Continue the conversation over chai"}
 ];
 return <footer style={{background:"#050b1d",color:"#fff",padding:"44px 32px 24px",marginTop:40}}>
  <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"minmax(280px,1.5fr) repeat(2,minmax(170px,.7fr))",gap:34}}>
   <div><div style={{fontSize:24,fontWeight:800}}>DeliverIQ</div><p style={{color:"#cbd5e1",lineHeight:1.7,maxWidth:520}}>Practical project delivery intelligence, free templates, role playbooks and AI-assisted governance — built for practitioners.</p>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}>{social.map(x=><a key={x.label} href={x.href} target="_blank" rel="noreferrer" title={x.desc} style={{display:"inline-flex",alignItems:"center",gap:9,padding:"10px 13px",border:"1px solid #344054",borderRadius:11,color:"#fff",textDecoration:"none",background:"#111827"}}><span style={{width:26,height:26,borderRadius:7,display:"grid",placeItems:"center",background:x.label==="Discussion over Chai"?"#f97316":"#344054",fontWeight:800}}>{x.icon}</span><span>{x.label}</span></a>)}</div>
   </div>
   <div><b>Resources</b><div style={{display:"grid",gap:13,marginTop:18,color:"#cbd5e1"}}><a href="/playbooks" style={{color:"inherit",textDecoration:"none"}}>Playbooks</a><a href="/templates" style={{color:"inherit",textDecoration:"none"}}>Free Templates</a><a href="/learn" style={{color:"inherit",textDecoration:"none"}}>Learning Hub</a><a href="/newsletter" style={{color:"inherit",textDecoration:"none"}}>Newsletter</a></div></div>
   <div><b>AI & Product</b><div style={{display:"grid",gap:13,marginTop:18,color:"#cbd5e1"}}><a href="/ai-lab" style={{color:"inherit",textDecoration:"none"}}>AI Lab</a><a href="/ai-future" style={{color:"inherit",textDecoration:"none"}}>AI Future</a><a href="/login" style={{color:"inherit",textDecoration:"none"}}>Project Workspace</a><a href="/integrations" style={{color:"inherit",textDecoration:"none"}}>Integration & Agent Hub</a></div></div>
  </div>
  <div style={{maxWidth:1200,margin:"32px auto 0",borderTop:"1px solid #263044",paddingTop:20,display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",color:"#98a2b3"}}><span>© 2026 DeliverIQ · Built by Sheuli A Mukherjee. All rights reserved.</span><span>Open playbooks & templates: CC BY 4.0 unless stated otherwise.</span></div>
 </footer>
}
