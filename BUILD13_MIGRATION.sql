create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  title text not null,
  description text,
  benefit_type text default 'financial',
  owner text,
  baseline_value numeric,
  target_value numeric,
  actual_value numeric,
  unit text,
  target_date date,
  status text default 'planned',
  confidence text default 'medium',
  evidence text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.benefits enable row level security;

create policy "Users manage project benefits"
on public.benefits for all
using (
  exists (
    select 1 from public.projects p
    where p.id = benefits.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = benefits.project_id and p.user_id = auth.uid()
  )
);

create index if not exists benefits_project_idx on public.benefits(project_id);
create index if not exists benefits_programme_idx on public.benefits(programme_id);

create table if not exists public.okrs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  objective text not null,
  key_result text not null,
  owner text,
  baseline_value numeric,
  target_value numeric,
  actual_value numeric,
  unit text,
  target_date date,
  status text default 'on_track',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.okrs enable row level security;

create policy "Users manage project okrs"
on public.okrs for all
using (
  exists (
    select 1 from public.projects p
    where p.id = okrs.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = okrs.project_id and p.user_id = auth.uid()
  )
);

create index if not exists okrs_project_idx on public.okrs(project_id);
create index if not exists okrs_programme_idx on public.okrs(programme_id);

create table if not exists public.value_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  value_score integer,
  review_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.value_reviews enable row level security;

create policy "Users manage own value reviews"
on public.value_reviews for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
