-- Build 4 assumes the projects and RAID tables from Build 2/3 exist.
-- Ensure Row Level Security is enabled and project ownership policies are present.
-- Optional audit table:

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  generation_type text not null,
  model text,
  input_summary text,
  output_json jsonb,
  created_at timestamptz not null default now()
);

alter table public.ai_generations enable row level security;

create policy "Users manage own AI generations"
on public.ai_generations for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
