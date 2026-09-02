create table if not exists public.integration_connections (
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users(id) on delete cascade not null,
 programme_id uuid references public.programmes(id) on delete cascade,
 project_id uuid references public.projects(id) on delete cascade,
 provider text not null,
 connection_name text not null,
 status text default 'configured',
 settings_json jsonb default '{}'::jsonb,
 created_at timestamptz default now()
);
alter table public.integration_connections enable row level security;
create policy "Users manage integrations" on public.integration_connections for all using(auth.uid()=user_id) with check(auth.uid()=user_id);

create table if not exists public.import_runs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users(id) on delete cascade not null,
 project_id uuid references public.projects(id) on delete cascade not null,
 source_type text not null,
 entity_type text not null,
 rows_received integer default 0,
 rows_imported integer default 0,
 errors_json jsonb default '[]'::jsonb,
 created_at timestamptz default now()
);
alter table public.import_runs enable row level security;
create policy "Users manage imports" on public.import_runs for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
