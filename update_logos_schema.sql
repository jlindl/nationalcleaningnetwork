-- 1. Add logo_url column to cleaners table
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='cleaners' and column_name='logo_url') then
        alter table public.cleaners add column logo_url text;
    end if;
end $$;

-- 2. Update the trigger function to handle logo_url
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
    insurance_doc_url,
    awards,
    service_types,
    other_service,
    base_location,
    service_radius,
    logo_url
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
    new.raw_user_meta_data ->> 'insuranceDocUrl',
    to_jsonb(new.raw_user_meta_data ->> 'awards'),
    -- Handle array casting safely
    coalesce(
        (select array_agg(x) from jsonb_array_elements_text(new.raw_user_meta_data -> 'serviceTypes') t(x)),
        '{}'::text[]
    ),
    new.raw_user_meta_data ->> 'otherService',
    new.raw_user_meta_data ->> 'baseLocation',
    (new.raw_user_meta_data ->> 'serviceRadius')::int,
    new.raw_user_meta_data ->> 'logoUrl'
  );
  return new;
end;
$$;

-- 3. Create the 'logos' bucket
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do update set public = true;

-- 4. Policies for 'logos' bucket
drop policy if exists "Anyone can view public logos" on storage.objects;
create policy "Anyone can view public logos"
on storage.objects for select
using ( bucket_id = 'logos' );

drop policy if exists "Cleaners can upload logos" on storage.objects;
create policy "Cleaners can upload logos"
on storage.objects for insert
with check ( bucket_id = 'logos' );
