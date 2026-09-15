'use client';
import { supabase } from "@/lib/supabase/browser";
import Link from "next/link";

export default function Shell({children}:{children:React.ReactNode}) {
  async function signOut() {
    await supabase.auth.signOut();
    location.href="/login";
  }
  return <>
    <header style={{height:64,padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",borderBottom:"1px solid #eee"}}>
      <Link href="/" aria-label="DeliverIQ home" style={{fontSize:24,fontWeight:800,color:"#101828",textDecoration:"none"}}>Deliver<span style={{color:"#635bff"}}>IQ</span></Link>
      <nav style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}><Link href="/">Home</Link><Link href="/projects">Projects</Link><Link href="/intelligence-studio">Intelligence Studio</Link><Link href="/prompt-library">Prompt Library</Link><Link href="/prooflayer">ProofLayer AI</Link><Link href="/learning-lab">Learning Lab</Link><Link href="/metrics/dashboard">Metrics Dashboard</Link><button onClick={signOut}>Sign out</button></nav>
    </header>
    {children}
  </>;
}
