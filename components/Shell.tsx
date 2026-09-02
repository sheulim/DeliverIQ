'use client';
import { supabase } from "@/lib/supabase/browser";

export default function Shell({children}:{children:React.ReactNode}) {
  async function signOut() {
    await supabase.auth.signOut();
    location.href="/login";
  }
  return <>
    <header style={{height:64,padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",borderBottom:"1px solid #eee"}}>
      <b style={{fontSize:24}}>Deliver<span style={{color:"#635bff"}}>IQ</span></b>
      <button onClick={signOut}>Sign out</button>
    </header>
    {children}
  </>;
}
