-- DeliverIQ Build 9 — Dependency Intelligence & Impact Simulation

alter table public.dependencies
add column if not exists upstream_dependency_id uuid references public.dependencies(id) on delete set null;

alter table public.dependencies
add column if not exists downstream_project_id uuid references public.projects(id) on delete set null;

alter table public.dependencies
add column if not exists milestone_id uuid references public.milestones(id) on delete set null;

alter table public.dependencies
add column if not exists criticality text default 'medium';

alter table public.dependencies
add column if not exists impact_days integer;

alter table public.dependencies
add column if not exists notes text;

create index if not exists dependencies_upstream_idx
on public.dependencies(upstream_dependency_id);

create index if not exists dependencies_downstream_project_idx
on public.dependencies(downstream_project_id);

create index if not exists dependencies_milestone_idx
on public.dependencies(milestone_id);

create table if not exists public.impact_simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  dependency_id uuid references public.dependencies(id) on delete set null,
  scenario_type text not null default 'dependency_slip',
  slip_days integer,
  assumptions_json jsonb,
  result_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.impact_simulations enable row level security;

create policy "Users manage own impact simulations"
on public.impact_simulations for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists impact_simulations_project_created_idx
on public.impact_simulations(project_id, created_at desc);

create index if not exists impact_simulations_programme_created_idx
on public.impact_simulations(programme_id, created_at desc);
