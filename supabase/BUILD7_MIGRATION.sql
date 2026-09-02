create table if not exists public.status_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  report_type text not null default 'weekly',
  reporting_period text,
  overall_health text,
  executive_summary text,
  report_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.status_reports enable row level security;

create policy "Users manage own status reports"
on public.status_reports for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists status_reports_project_created_idx
on public.status_reports(project_id, created_at desc);
