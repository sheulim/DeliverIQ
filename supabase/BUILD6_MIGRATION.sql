-- DeliverIQ Build 6
-- Adds project-level delivery snapshots used for trend analysis.

create table if not exists public.delivery_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  open_risks integer not null default 0,
  high_risks integer not null default 0,
  open_issues integer not null default 0,
  open_decisions integer not null default 0,
  open_dependencies integer not null default 0,
  overdue_dependencies integer not null default 0,
  upcoming_milestones integer not null default 0,
  overdue_milestones integer not null default 0,
  ageing_raid integer not null default 0,
  delivery_confidence integer,
  snapshot_json jsonb,
  created_at timestamptz not null default now()
);

alter table public.delivery_snapshots enable row level security;

create policy "Users manage own delivery snapshots"
on public.delivery_snapshots for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists delivery_snapshots_project_created_idx
on public.delivery_snapshots(project_id, created_at desc);
