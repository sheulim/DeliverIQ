create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade not null,
  meeting_type text not null default 'weekly_delivery_review',
  title text not null,
  meeting_date timestamptz,
  attendees text[],
  raw_notes text,
  minutes_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.meetings enable row level security;

create policy "Users manage own meetings"
on public.meetings for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists meetings_project_created_idx
on public.meetings(project_id, created_at desc);

create index if not exists meetings_programme_created_idx
on public.meetings(programme_id, created_at desc);
