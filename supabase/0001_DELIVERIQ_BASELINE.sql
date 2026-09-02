-- DeliverIQ consolidated baseline: core workspace + newsletter + connector hub
create extension if not exists "pgcrypto";

do $$ begin create type project_health as enum ('green','amber','red'); exception when duplicate_object then null; end $$;
do $$ begin create type raid_item_type as enum ('risk','assumption','issue','decision'); exception when duplicate_object then null; end $$;
do $$ begin create type raid_status as enum ('open','monitoring','resolved','closed'); exception when duplicate_object then null; end $$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null,
  name text not null, description text, project_type text, methodology text, health project_health not null default 'green',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.raid_items (
  id uuid primary key default gen_random_uuid(), project_id uuid references public.projects(id) on delete cascade not null,
  item_type raid_item_type not null, title text not null, description text, owner text,
  probability int check(probability between 1 and 5), impact int check(impact between 1 and 5),
  score int generated always as (case when probability is not null and impact is not null then probability*impact else null end) stored,
  status raid_status not null default 'open', due_date date, mitigation text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.milestones (
 id uuid primary key default gen_random_uuid(), project_id uuid references public.projects(id) on delete cascade not null,
 name text not null, target_date date, status text not null default 'not_started', created_at timestamptz not null default now()
);
create table if not exists public.dependencies (
 id uuid primary key default gen_random_uuid(), project_id uuid references public.projects(id) on delete cascade not null,
 title text not null, provider text, consumer text, due_date date, status text not null default 'open', impact text, created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
 id uuid primary key default gen_random_uuid(), email text unique not null, name text, status text not null default 'subscribed', source text default 'website',
 created_at timestamptz not null default now(), unsubscribed_at timestamptz
);
create table if not exists public.newsletters (
 id uuid primary key default gen_random_uuid(), author_id uuid references auth.users(id) on delete set null,
 issue_number int, slug text unique not null, title text not null, summary text, body text not null default '',
 status text not null default 'draft' check(status in ('draft','scheduled','published')),
 published_at timestamptz, scheduled_for timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.integration_connections (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null,
 project_id uuid references public.projects(id) on delete cascade, name text not null,
 connector_type text not null check(connector_type in ('mcp','rest','webhook','native')),
 endpoint_url text, status text not null default 'draft' check(status in ('draft','testing','active','disabled','error')),
 permissions jsonb not null default '{"read":true,"recommend":false,"draft":false,"execute":false}'::jsonb,
 config jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.connector_audit_log (
 id bigint generated always as identity primary key, connection_id uuid references public.integration_connections(id) on delete set null,
 user_id uuid references auth.users(id) on delete set null, agent_name text, action text not null,
 permission_level text, request_summary text, result_summary text, approved_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.raid_items enable row level security;
alter table public.milestones enable row level security;
alter table public.dependencies enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletters enable row level security;
alter table public.integration_connections enable row level security;
alter table public.connector_audit_log enable row level security;

do $$ begin create policy "Users manage own projects" on public.projects for all using(auth.uid()=user_id) with check(auth.uid()=user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users manage RAID through owned project" on public.raid_items for all using(exists(select 1 from public.projects p where p.id=raid_items.project_id and p.user_id=auth.uid())) with check(exists(select 1 from public.projects p where p.id=raid_items.project_id and p.user_id=auth.uid())); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users manage milestones through owned project" on public.milestones for all using(exists(select 1 from public.projects p where p.id=milestones.project_id and p.user_id=auth.uid())) with check(exists(select 1 from public.projects p where p.id=milestones.project_id and p.user_id=auth.uid())); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users manage dependencies through owned project" on public.dependencies for all using(exists(select 1 from public.projects p where p.id=dependencies.project_id and p.user_id=auth.uid())) with check(exists(select 1 from public.projects p where p.id=dependencies.project_id and p.user_id=auth.uid())); exception when duplicate_object then null; end $$;
do $$ begin create policy "Public newsletter signup" on public.newsletter_subscribers for insert with check(status='subscribed'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Published newsletters are public" on public.newsletters for select using(status='published' or auth.uid()=author_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authors manage own newsletters" on public.newsletters for all using(auth.uid()=author_id) with check(auth.uid()=author_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users manage own connections" on public.integration_connections for all using(auth.uid()=user_id) with check(auth.uid()=user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users view own connector audit" on public.connector_audit_log for select using(auth.uid()=user_id or auth.uid()=approved_by); exception when duplicate_object then null; end $$;
