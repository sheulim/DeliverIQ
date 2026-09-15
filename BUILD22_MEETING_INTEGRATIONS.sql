create table if not exists public.meeting_connections(
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users(id) on delete cascade not null,
 provider text not null check(provider in ('zoom','microsoft_teams','slack','google_meet','manual')),
 connection_name text,
 status text default 'not_connected',
 settings_json jsonb default '{}'::jsonb,
 created_at timestamptz default now()
);
alter table public.meeting_connections enable row level security;
create policy "Users manage meeting connections" on public.meeting_connections for all
using(auth.uid()=user_id) with check(auth.uid()=user_id);

create table if not exists public.meeting_ingestion_jobs(
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users(id) on delete cascade not null,
 provider text not null,
 external_meeting_id text,
 meeting_title text,
 meeting_start timestamptz,
 transcript_text text,
 transcript_source text,
 status text default 'received',
 project_id uuid references public.projects(id) on delete set null,
 programme_id uuid references public.programmes(id) on delete set null,
 created_at timestamptz default now()
);
alter table public.meeting_ingestion_jobs enable row level security;
create policy "Users manage meeting ingestion" on public.meeting_ingestion_jobs for all
using(auth.uid()=user_id) with check(auth.uid()=user_id);
