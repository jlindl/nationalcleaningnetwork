-- 1. Update the trigger function to include insurance_doc_url from metadata
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
    new.raw_user_meta_data ->> 'insuranceDocUrl',
    to_jsonb(new.raw_user_meta_data ->> 'awards'),
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

-- 2. Update storage policy to allow anonymous uploads (since we upload before signup)
drop policy if exists "Cleaners can upload documents" on storage.objects;
create policy "Cleaners can upload documents"
on storage.objects for insert
with check (bucket_id = 'documents');

-- 3. Add SELECT policy for onboarding leads to fix 401 on insert returning id
drop policy if exists "Anyone can select onboarding leads" on public.onboarding_leads;
create policy "Anyone can select onboarding leads"
on public.onboarding_leads for select
using (true);
