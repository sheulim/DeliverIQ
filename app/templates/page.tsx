import Link from "next/link";
import {templateCatalog} from "@/lib/content/templateCatalog";

export default function TemplatesPage(){
 return <main style={{padding:32,maxWidth:1250,margin:"0 auto"}}>
  <Link href="/">← Home</Link>
  <h1>DeliverIQ Open PM Template Library</h1>
  <p style={{color:"#667085",fontSize:18}}>Free, ready-to-use project-management templates. Open the master workbook directly in Microsoft Excel, upload it to Google Sheets, or download CSV + JSON versions for automation and AI workflows.</p>
  <div style={{display:"flex",gap:10,flexWrap:"wrap",margin:"20px 0 28px"}}>
   <a href="/downloads/DeliverIQ_Open_PM_Toolkit.xlsx" download style={{padding:"12px 16px",background:"#635bff",color:"#fff",borderRadius:10,textDecoration:"none",fontWeight:700}}>Download Excel Toolkit (.xlsx)</a>
   <a href="/downloads/DeliverIQ_Open_PM_Toolkit_All_Formats.zip" download style={{padding:"12px 16px",background:"#fff",border:"1px solid #d0d5dd",borderRadius:10,textDecoration:"none",fontWeight:700}}>Download CSV + JSON Bundle</a>
  </div>
  {templateCatalog.map(area=><section key={area.area} style={{marginBottom:30}}>
   <h2>{area.area}</h2>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
    {area.templates.map(t=><article key={t.name} style={{background:"#fff",border:"1px solid #e6e8ef",borderRadius:14,padding:18}}>
     <small style={{background:"#f2f4f7",padding:"4px 7px",borderRadius:999}}>{t.level}</small>
     <h3>{t.name}</h3>
     <p style={{color:"#667085"}}>{t.fields.join(" · ")}</p>
     <p style={{fontSize:12,color:"#98a2b3"}}>Included in Excel, CSV and AI-friendly JSON formats.</p>
    </article>)}
   </div>
  </section>)}
  <p>Original DeliverIQ templates are free to use and adapt under CC BY 4.0 with attribution to <b>Sheuli A Mukherjee — DeliverIQ</b>.</p>
 </main>
}
