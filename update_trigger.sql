-- 1. Fix the array cast for service_types to prevent trigger execution errors when joining.
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
    coalesce(new.raw_user_meta_data ->> 'firstName', 'User'),
    coalesce(new.raw_user_meta_data ->> 'lastName', ''),
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.raw_user_meta_data ->> 'companyName', 'Company'),
    new.raw_user_meta_data ->> 'companyNumber',
    new.raw_user_meta_data ->> 'officeAddress',
    new.raw_user_meta_data ->> 'insurerName',
    new.raw_user_meta_data ->> 'insuranceDocUrl',
    to_jsonb(new.raw_user_meta_data ->> 'awards'),
    -- Safely parse the json array to a postgres text array
    coalesce(
      (
        select array_agg(x) 
        from jsonb_array_elements_text(
          case 
            when new.raw_user_meta_data ? 'serviceTypes' and jsonb_typeof(new.raw_user_meta_data -> 'serviceTypes') = 'array' 
            then new.raw_user_meta_data -> 'serviceTypes' 
            else '[]'::jsonb 
          end
        ) t(x)
      ), 
      '{}'::text[]
    ),
    new.raw_user_meta_data ->> 'otherService',
    new.raw_user_meta_data ->> 'baseLocation',
    nullif(new.raw_user_meta_data ->> 'serviceRadius', '')::int
  );
  return new;
end;
$$;
