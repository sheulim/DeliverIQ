import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProgrammesPage(){
  const sb=await createClient();
  const {data:programmes=[]}=await sb.from("programmes").select("*").order("created_at",{ascending:false});

  return <main style={{padding:32,maxWidth:1180,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:15}}>
      <div>
        <h1>Programmes & Portfolio</h1>
        <p style={{color:"#667085"}}>Roll up multiple projects into programme-level delivery intelligence.</p>
      </div>
      <Link href="/programmes/new">+ Create Programme</Link>
    </div>

    <section style={{marginTop:24}}>
      {programmes.length===0 ? <p>No programmes yet.</p> :
        programmes.map((p:any)=>
          <div key={p.id} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:12,padding:16,margin:"10px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <b>{p.name}</b>
              <div style={{color:"#667085",marginTop:4}}>{p.description || "No description"} · Health: {(p.health||"green").toUpperCase()}</div>
            </div>
            <Link href={"/programmes/"+p.id}>Open</Link>
          </div>
        )
      }
    </section>
  </main>;
}
