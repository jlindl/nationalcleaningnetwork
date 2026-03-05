-- Check if there are ANY rows matching this auth ID, overriding RLS to be sure
create or replace function get_cleaner_count_for_user(user_uuid uuid)
returns integer
language plpgsql
security definer
as $$
declare
    cleaner_count integer;
begin
    select count(*) into cleaner_count from public.cleaners where user_id = user_uuid;
    return cleaner_count;
end;
$$;
