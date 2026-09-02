create table if not exists public.actions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  source_type text,
  source_id uuid,
  title text not null,
  description text,
  owner text,
  due_date date,
  priority text default 'medium',
  status text default 'open',
  escalation_level text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.actions enable row level security;

create policy "Users manage project actions"
on public.actions for all
using (
  exists (
    select 1 from public.projects p
    where p.id = actions.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = actions.project_id and p.user_id = auth.uid()
  )
);

create index if not exists actions_project_idx on public.actions(project_id);
create index if not exists actions_programme_idx on public.actions(programme_id);
create index if not exists actions_due_status_idx on public.actions(due_date,status);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  title text not null,
  context text,
  decision text,
  rationale text,
  owner_or_forum text,
  decision_date date,
  due_date date,
  status text default 'pending',
  impact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.decisions enable row level security;

create policy "Users manage project decisions"
on public.decisions for all
using (
  exists (
    select 1 from public.projects p
    where p.id = decisions.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = decisions.project_id and p.user_id = auth.uid()
  )
);

create index if not exists decisions_project_idx on public.decisions(project_id);
create index if not exists decisions_programme_idx on public.decisions(programme_id);
