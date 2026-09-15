'use client';
import {useState} from "react";
import {supabase} from "@/lib/supabase/browser";

export default function RaidManager({projectId,initialItems}:{projectId:string,initialItems:any[]}) {
  const [items,setItems]=useState(initialItems);
  const [type,setType]=useState("risk");
  const [title,setTitle]=useState("");
  const [owner,setOwner]=useState("");

  async function add() {
    if(!title.trim()) return;
    const {data,error}=await supabase.from("raid_items").insert({
      project_id:projectId,item_type:type,title,owner:owner||null,status:"open"
    }).select().single();
    if(!error&&data){setItems([data,...items]);setTitle("");setOwner("");}
  }

  async function remove(id:string) {
    await supabase.from("raid_items").delete().eq("id",id);
    setItems(items.filter(x=>x.id!==id));
  }

  return <section style={{marginTop:30}}>
    <h2>RAID Manager</h2>
    {["risk","assumption","issue","decision"].map(t=>
      <button key={t} onClick={()=>setType(t)} style={{marginRight:8,fontWeight:type===t?"bold":"normal"}}>{t}</button>
    )}
    <div style={{margin:"18px 0"}}>
      <input placeholder="RAID title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Owner" value={owner} onChange={e=>setOwner(e.target.value)} style={{marginLeft:8}} />
      <button onClick={add} style={{marginLeft:8}}>Add</button>
    </div>
    {items.filter(x=>x.item_type===type).map(x=>
      <div key={x.id} style={{padding:12,borderBottom:"1px solid #ddd"}}>
        <b>{x.title}</b> — {x.owner || "Unassigned"} — {x.status}
        <button onClick={()=>remove(x.id)} style={{marginLeft:12}}>Delete</button>
      </div>
    )}
  </section>;
}
