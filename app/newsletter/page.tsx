import NewsletterSignup from '@/components/NewsletterSignup';
export default function Newsletter(){
 const issues=[
  {n:'Coming soon',title:'DeliverIQ Weekly Delivery Insights',summary:'Practical project delivery intelligence, AI-native ways of working, metrics, governance and lessons for delivery leaders.'}
 ];
 return <main style={{maxWidth:1050,margin:'40px auto',padding:24}}><h1>DeliverIQ Newsletter</h1><p style={{fontSize:18,color:'#475569'}}>A weekly briefing for Scrum Masters, Delivery Managers, Project Managers, Program Managers and Portfolio leaders.</p><NewsletterSignup/><h2 style={{marginTop:36}}>Issue archive</h2><div style={{display:'grid',gap:16}}>{issues.map(i=><article key={i.title} style={{border:'1px solid #e2e8f0',borderRadius:14,padding:20}}><small>{i.n}</small><h3>{i.title}</h3><p>{i.summary}</p></article>)}</div></main>
}
