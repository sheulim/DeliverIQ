create table if not exists public.stakeholders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  name text not null,
  role text,
  organisation text,
  stakeholder_type text default 'internal',
  influence text default 'medium',
  interest text default 'medium',
  sentiment text default 'neutral',
  preferred_channel text,
  communication_frequency text,
  key_needs text,
  engagement_strategy text,
  owner text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stakeholders enable row level security;

create policy "Users manage project stakeholders"
on public.stakeholders for all
using (
  exists (
    select 1 from public.projects p
    where p.id = stakeholders.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = stakeholders.project_id and p.user_id = auth.uid()
  )
);

create index if not exists stakeholders_project_idx on public.stakeholders(project_id);
create index if not exists stakeholders_programme_idx on public.stakeholders(programme_id);

create table if not exists public.communications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  stakeholder_id uuid references public.stakeholders(id) on delete set null,
  audience_type text,
  communication_type text,
  subject text,
  body text not null,
  source_context jsonb,
  status text default 'draft',
  created_at timestamptz not null default now()
);

alter table public.communications enable row level security;

create policy "Users manage project communications"
on public.communications for all
using (
  exists (
    select 1 from public.projects p
    where p.id = communications.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = communications.project_id and p.user_id = auth.uid()
  )
);

create index if not exists communications_project_created_idx
on public.communications(project_id, created_at desc);
