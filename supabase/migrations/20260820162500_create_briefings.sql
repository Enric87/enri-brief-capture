create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_name text,
  company text,
  project_title text,
  project_types text[] not null default '{}',
  form_data jsonb not null default '{}'::jsonb,
  visual_references jsonb not null default '[]'::jsonb,
  status text not null default 'completed'
);

create index if not exists briefings_created_at_idx on public.briefings (created_at desc);
create index if not exists briefings_client_name_idx on public.briefings (client_name);
create index if not exists briefings_company_idx on public.briefings (company);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists briefings_set_updated_at on public.briefings;
create trigger briefings_set_updated_at
before update on public.briefings
for each row
execute function public.set_updated_at();

alter table public.briefings enable row level security;

drop policy if exists "Allow public insert briefings" on public.briefings;
create policy "Allow public insert briefings"
on public.briefings
for insert
with check (true);

drop policy if exists "Allow public read briefings" on public.briefings;
create policy "Allow public read briefings"
on public.briefings
for select
using (true);

drop policy if exists "Allow public update briefings" on public.briefings;
create policy "Allow public update briefings"
on public.briefings
for update
using (true)
with check (true);
