import Link from "next/link";
import {playbooks} from "@/lib/content/playbooks";

export default function PlaybooksPage(){
  return <main style={{padding:32,maxWidth:1200,margin:"0 auto"}}>
    <Link href="/">← Home</Link>
    <h1>Role Playbooks</h1>
    <p>Practical, reusable guidance for the five core project-delivery leadership roles.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
      {playbooks.map(p=><article key={p.role} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:20}}>
        <h2>{p.role}</h2><p>{p.tagline}</p>
        <ul>{p.sections.map((s,i)=><li key={i} style={{marginBottom:8}}>{s}</li>)}</ul>
      </article>)}
    </div>
    <p style={{marginTop:24}}>DeliverIQ original playbook content is reusable under CC BY 4.0 with attribution to Sheuli A Mukherjee — DeliverIQ.</p>
  </main>
}
