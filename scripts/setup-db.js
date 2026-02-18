const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:NationalCleaningNetwork2005!@db.jjpmwfjzpuztjpmozsbq.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

const setupSQL = `
-- Create cleaners table if not exists
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

-- Note: We are using "do $$ begin ... end $$" blocks for policies to avoid errors if they already exist

-- Policy: Cleaners can insert their own data
do $$ begin
  create policy "Cleaners can insert their own data"
  on public.cleaners for insert
  with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- Policy: Cleaners can view their own data
do $$ begin
  create policy "Cleaners can view their own data"
  on public.cleaners for select
  using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;


-- Trigger Function to handle new user creation from Supabase Auth
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
    awards
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
    to_jsonb(new.raw_user_meta_data ->> 'awards')
  );
  return new;
end;
$$;

-- Trigger logic (drop if exists to avoid duplication errors on re-run)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket setup usually requires different permissions or using the Supabase API directly, 
-- but we can try inserting into storage.buckets if the role allows it.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;


do $$ begin
  create policy "Cleaners can upload documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.uid() = owner);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Cleaners can view own documents"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.uid() = owner);
exception when duplicate_object then null;
end $$;
`;

async function main() {
    try {
        await client.connect();
        console.log('Connected to database...');
        await client.query(setupSQL);
        console.log('Database setup complete!');
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

main();
