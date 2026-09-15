create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  requirement_key text,
  title text not null,
  description text,
  requirement_type text default 'business',
  priority text default 'medium',
  owner text,
  status text default 'approved',
  acceptance_criteria text,
  source text,
  created_at timestamptz default now()
);
alter table public.requirements enable row level security;
create policy "Users manage requirements" on public.requirements for all
using (exists(select 1 from public.projects p where p.id=requirements.project_id and p.user_id=auth.uid()))
with check (exists(select 1 from public.projects p where p.id=requirements.project_id and p.user_id=auth.uid()));

create table if not exists public.change_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  change_key text,
  title text not null,
  description text,
  reason text,
  requested_by text,
  owner text,
  status text default 'proposed',
  priority text default 'medium',
  schedule_impact_days integer,
  cost_impact numeric,
  capacity_impact text,
  risk_impact text,
  benefit_impact text,
  decision text,
  decision_owner text,
  decision_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.change_requests enable row level security;
create policy "Users manage change requests" on public.change_requests for all
using (exists(select 1 from public.projects p where p.id=change_requests.project_id and p.user_id=auth.uid()))
with check (exists(select 1 from public.projects p where p.id=change_requests.project_id and p.user_id=auth.uid()));

create table if not exists public.change_requirement_links (
  change_id uuid references public.change_requests(id) on delete cascade,
  requirement_id uuid references public.requirements(id) on delete cascade,
  primary key(change_id, requirement_id)
);
alter table public.change_requirement_links enable row level security;
