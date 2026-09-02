create table if not exists public.newsletter_subscribers(
 id uuid primary key default gen_random_uuid(),
 email text unique not null,
 name text,
 status text default 'subscribed',
 source text default 'website',
 subscribed_at timestamptz default now(),
 unsubscribed_at timestamptz
);
alter table public.newsletter_subscribers enable row level security;

create policy "Public can subscribe newsletter"
on public.newsletter_subscribers for insert
with check (status='subscribed');
