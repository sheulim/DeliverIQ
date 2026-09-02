import Link from "next/link";
const items=[
 {title:"AI & The Future of Indian Businesses — Vaibhav Sisinty",type:"Podcast",url:"https://www.youtube.com/watch?v=7KxjHxj3rKk",note:"AI adoption, agents, productivity and business transformation."},
 {title:"Is Your Job Safe from AI? — Vaibhav Sisinty",type:"AI Career / Community",url:"https://www.youtube.com/watch?v=9I5K8LasZ2c",note:"AI updates, professional impact and community links."},
 {title:"Scrum & Agile Learning",type:"Project Delivery",url:"https://www.youtube.com/results?search_query=scrum+agile+project+management",note:"Curated external learning search."},
 {title:"AI for Project Management",type:"AI + PM",url:"https://www.youtube.com/results?search_query=AI+for+project+management",note:"Explore current AI-in-PM content."}
];
export default function Page(){return <main style={{padding:32,maxWidth:1100,margin:"0 auto"}}><Link href="/">← Home</Link><h1>PM Learning Hub</h1><p>Curated AI, delivery and project-management learning. Third-party content remains owned by its creators.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>{items.map(x=><article key={x.url} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}><small>{x.type}</small><h2 style={{fontSize:20}}>{x.title}</h2><p>{x.note}</p><a href={x.url} target="_blank" rel="noreferrer">Open learning link ↗</a></article>)}</div></main>}
