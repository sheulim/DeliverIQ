create table if not exists public.project_budgets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  currency text default 'USD',
  approved_budget numeric,
  contingency_budget numeric default 0,
  baseline_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_budgets enable row level security;

create policy "Users manage project budgets"
on public.project_budgets for all
using (
  exists (
    select 1 from public.projects p
    where p.id = project_budgets.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = project_budgets.project_id and p.user_id = auth.uid()
  )
);

create unique index if not exists project_budgets_project_unique
on public.project_budgets(project_id);

create table if not exists public.cost_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  cost_date date not null,
  category text not null,
  description text,
  cost_type text default 'actual',
  amount numeric not null,
  owner text,
  vendor text,
  status text default 'posted',
  created_at timestamptz not null default now()
);

alter table public.cost_entries enable row level security;

create policy "Users manage project costs"
on public.cost_entries for all
using (
  exists (
    select 1 from public.projects p
    where p.id = cost_entries.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = cost_entries.project_id and p.user_id = auth.uid()
  )
);

create index if not exists cost_entries_project_date_idx
on public.cost_entries(project_id, cost_date desc);

create table if not exists public.financial_forecasts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  forecast_date date not null default current_date,
  estimate_to_complete numeric,
  estimate_at_completion numeric,
  forecast_method text default 'manual',
  assumptions text,
  created_at timestamptz not null default now()
);

alter table public.financial_forecasts enable row level security;

create policy "Users manage project financial forecasts"
on public.financial_forecasts for all
using (
  exists (
    select 1 from public.projects p
    where p.id = financial_forecasts.project_id and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = financial_forecasts.project_id and p.user_id = auth.uid()
  )
);

create index if not exists financial_forecasts_project_created_idx
on public.financial_forecasts(project_id, created_at desc);

create table if not exists public.financial_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  programme_id uuid references public.programmes(id) on delete set null,
  financial_health text,
  forecast_variance numeric,
  review_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.financial_reviews enable row level security;

create policy "Users manage own financial reviews"
on public.financial_reviews for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists financial_reviews_project_created_idx
on public.financial_reviews(project_id, created_at desc);
