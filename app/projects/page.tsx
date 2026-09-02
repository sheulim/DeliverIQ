import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Projects() {
  const supabase = await createClient();
  const { data: projects = [] } = await supabase
    .from("projects")
    .select("id,name,project_type,methodology,health,created_at")
    .order("created_at", { ascending: false });

  return (
    <main style={{padding:32}}>
      <h1>DeliverIQ — My Projects</h1>
      <p>Your delivery portfolio and project workspaces.</p>
      <Link href="/projects/new">+ Create Project with AI</Link>
      <hr />
      {projects.length === 0 ? <p>No projects yet.</p> :
        projects.map(p => (
          <div key={p.id} style={{padding:16,borderBottom:"1px solid #ddd"}}>
            <b>{p.name}</b><br/>
            {p.project_type || "Project"} · {p.methodology || "Methodology not set"} · {p.health || "green"}
            {" "}<Link href={"/projects/"+p.id}>Open</Link>
          </div>
        ))}
    </main>
  );
}
