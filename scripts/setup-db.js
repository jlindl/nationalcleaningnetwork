const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:NationalCleaningNetwork2005!@db.jjpmwfjzpuztjpmozsbq.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const setupSQL = `
-- Create cleaners table if not exists (base structure)
create table if not exists public.cleaners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  company_name text not null,
  company_number text,
  office_address text,
  insurer_name text,
  insurance_doc_url text,
  awards jsonb,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.cleaners enable row level security;

-- Add new columns if they don't exist (Migration logic)
do $$ 
begin
    -- service_types
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='cleaners' and column_name='service_types') then
        alter table public.cleaners add column service_types text[] default '{}';
    end if;

    -- other_service
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='cleaners' and column_name='other_service') then
        alter table public.cleaners add column other_service text;
    end if;

    -- base_location
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='cleaners' and column_name='base_location') then
        alter table public.cleaners add column base_location text;
    end if;

    -- service_radius
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='cleaners' and column_name='service_radius') then
        alter table public.cleaners add column service_radius integer;
    end if;
end $$;

-- Policies for Cleaners Table (DROP existing first to avoid conflicts)
drop policy if exists "Cleaners can insert their own data" on public.cleaners;
create policy "Cleaners can insert their own data"
on public.cleaners for insert
with check (auth.uid() = user_id);

drop policy if exists "Cleaners can view their own data" on public.cleaners;
create policy "Cleaners can view their own data"
on public.cleaners for select
using (auth.uid() = user_id);

drop policy if exists "Cleaners can update their own data" on public.cleaners;
create policy "Cleaners can update their own data"
on public.cleaners for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Trigger Function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.cleaners (
    user_id,
    email,
    first_name,
    last_name,
    phone,
    company_name,
    company_number,
    office_address,
    insurer_name,
    awards,
    service_types,
    other_service,
    base_location,
    service_radius
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'firstName',
    new.raw_user_meta_data ->> 'lastName',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'companyName',
    new.raw_user_meta_data ->> 'companyNumber',
    new.raw_user_meta_data ->> 'officeAddress',
    new.raw_user_meta_data ->> 'insurerName',
    to_jsonb(new.raw_user_meta_data ->> 'awards'),
    -- Handle array casting safely
    coalesce(
        (select array_agg(x) from jsonb_array_elements_text(new.raw_user_meta_data -> 'serviceTypes') t(x)),
        '{}'::text[]
    ),
    new.raw_user_meta_data ->> 'otherService',
    new.raw_user_meta_data ->> 'baseLocation',
    (new.raw_user_meta_data ->> 'serviceRadius')::int
  );
  return new;
end;
$$;

-- Trigger logic
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket setup
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = true;

-- Policies for Storage (DROP existing first)
drop policy if exists "Cleaners can upload documents" on storage.objects;
create policy "Cleaners can upload documents"
on storage.objects for insert
with check (bucket_id = 'documents' and auth.uid() = owner);

drop policy if exists "Cleaners can view own documents" on storage.objects;
create policy "Cleaners can view own documents"
on storage.objects for select
using (bucket_id = 'documents' and auth.uid() = owner);
`;

async function main() {
  try {
    await client.connect();
    console.log('Connected to database...');
    await client.query(setupSQL);
    console.log('Database setup complete! Updated schema and functions.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

main();
