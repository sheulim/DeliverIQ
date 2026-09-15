-- DeliverIQ Build 8 — Programme / Portfolio layer

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  owner text,
  status text default 'active',
  health text default 'green',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.programmes enable row level security;

create policy "Users manage own programmes"
on public.programmes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter table public.projects
add column if not exists programme_id uuid references public.programmes(id) on delete set null;

create index if not exists projects_programme_idx
on public.projects(programme_id);

create table if not exists public.programme_reviews (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid references public.programmes(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  overall_health text,
  delivery_confidence integer,
  review_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.programme_reviews enable row level security;

create policy "Users manage own programme reviews"
on public.programme_reviews for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists programme_reviews_programme_created_idx
on public.programme_reviews(programme_id, created_at desc);
