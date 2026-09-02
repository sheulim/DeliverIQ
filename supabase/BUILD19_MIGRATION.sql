create table if not exists public.audit_log(
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users(id) on delete set null,
 project_id uuid references public.projects(id) on delete cascade,
 programme_id uuid references public.programmes(id) on delete cascade,
 action_type text not null,
 entity_type text,
 entity_id uuid,
 details_json jsonb default '{}'::jsonb,
 created_at timestamptz default now()
);
alter table public.audit_log enable row level security;
create policy "Users view own audit" on public.audit_log for select using(auth.uid()=user_id);

create table if not exists public.workspace_settings(
 user_id uuid primary key references auth.users(id) on delete cascade,
 default_currency text default 'USD',
 ai_enabled boolean default true,
 ai_human_review_required boolean default true,
 data_retention_days integer default 365,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);
alter table public.workspace_settings enable row level security;
create policy "Users manage settings" on public.workspace_settings for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
