import AgileAssistant from "@/components/AgileAssistant";
import SiteFooter from "@/components/SiteFooter";
export const metadata={title:"DeliverIQ - AI Project Delivery Command Centre",description:"The Intelligence Layer for Project Delivery. Copyright © 2026 Sheuli A Mukherjee."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body style={{margin:0,background:"#f8fafc",color:"#101828"}}>{children}<SiteFooter/><AgileAssistant/></body></html>}
