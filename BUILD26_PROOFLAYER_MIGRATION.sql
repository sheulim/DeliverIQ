-- DeliverIQ Build 26: ProofLayer evidence and decision provenance foundation
create table if not exists public.migration_acceptance_evidence (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
 gate smallint not null check (gate between 1 and 3), domain text not null, criterion text not null, owner_role text,
 status text not null default 'insufficient_evidence' check(status in ('insufficient_evidence','at_risk','satisfied','not_satisfied')),
 evidence_reference text, is_critical boolean not null default false, waiver_requested boolean not null default false,
 waiver_rationale text, verified_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.migration_acceptance_decisions (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
 gate smallint not null check (gate between 1 and 3), recommendation text not null,
 human_decision text check(human_decision in ('go','conditional_go','no_go','deferred')), decided_by uuid references auth.users(id),
 decision_rationale text, decided_at timestamptz, created_at timestamptz not null default now()
);
alter table public.migration_acceptance_evidence enable row level security;
alter table public.migration_acceptance_decisions enable row level security;
drop policy if exists proof_evidence_project_owner on public.migration_acceptance_evidence;
create policy proof_evidence_project_owner on public.migration_acceptance_evidence for all to authenticated using(exists(select 1 from public.projects p where p.id=project_id and p.user_id=auth.uid())) with check(exists(select 1 from public.projects p where p.id=project_id and p.user_id=auth.uid()));
drop policy if exists proof_decision_project_owner on public.migration_acceptance_decisions;
create policy proof_decision_project_owner on public.migration_acceptance_decisions for all to authenticated using(exists(select 1 from public.projects p where p.id=project_id and p.user_id=auth.uid())) with check(exists(select 1 from public.projects p where p.id=project_id and p.user_id=auth.uid()));
