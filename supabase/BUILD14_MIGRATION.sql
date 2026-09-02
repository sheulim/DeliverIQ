create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  name text not null,
  role text,
  team text,
  capacity_per_period numeric,
  allocation_percent numeric default 100,
  available_from date,
  available_to date,
  status text default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Users manage project resources"
on public.resources for all
using (
  exists (
    select 1 from public.projects p
    where p.id = resources.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = resources.project_id and p.user_id = auth.uid()
  )
);

create index if not exists resources_project_idx on public.resources(project_id);
create index if not exists resources_programme_idx on public.resources(programme_id);

create table if not exists public.capacity_periods (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  period_start date not null,
  period_end date not null,
  planned_capacity numeric,
  planned_demand numeric,
  delivered_throughput numeric,
  unit text default 'points',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.capacity_periods enable row level security;

create policy "Users manage project capacity"
on public.capacity_periods for all
using (
  exists (
    select 1 from public.projects p
    where p.id = capacity_periods.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = capacity_periods.project_id and p.user_id = auth.uid()
  )
);

create index if not exists capacity_periods_project_start_idx
on public.capacity_periods(project_id, period_start desc);

create table if not exists public.delivery_forecasts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  target_date date,
  confidence_score integer,
  forecast_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.delivery_forecasts enable row level security;

create policy "Users manage own delivery forecasts"
on public.delivery_forecasts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists delivery_forecasts_project_created_idx
on public.delivery_forecasts(project_id, created_at desc);
