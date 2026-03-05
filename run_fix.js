const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL() {
    try {
        console.log("Running backfill via RPC block...");

        // Use an anonymous code block executed via RPC to fix the trigger and data
        const sql = `
            -- Fix missing logo_url for users who uploaded one during onboarding but the old trigger dropped it
            update public.cleaners 
            set logo_url = (
                select raw_user_meta_data->>'logoUrl'
                from auth.users
                where auth.users.id = public.cleaners.user_id
            )
            where logo_url is null and (
                select raw_user_meta_data->>'logoUrl'
                from auth.users
                where auth.users.id = public.cleaners.user_id
            ) is not null;

            -- Re-run the logo trigger from update_logos_schema.sql to ensure new users are caught
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
                coalesce(new.raw_user_meta_data ->> 'firstName', 'User'),
                coalesce(new.raw_user_meta_data ->> 'lastName', ''),
                new.raw_user_meta_data ->> 'phone',
                coalesce(new.raw_user_meta_data ->> 'companyName', 'Company'),
                new.raw_user_meta_data ->> 'companyNumber',
                new.raw_user_meta_data ->> 'officeAddress',
                new.raw_user_meta_data ->> 'insurerName',
                new.raw_user_meta_data ->> 'insuranceDocUrl',
                to_jsonb(new.raw_user_meta_data ->> 'awards'),
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
                nullif(new.raw_user_meta_data ->> 'serviceRadius', '')::int,
                new.raw_user_meta_data ->> 'logoUrl'
            );
            return new;
            end;
            $$;
        `;

        // The JS client cannot run raw DDL/SQL unless exposed via an RPC. 
        console.log("Since raw SQL through JS Client is restricted without an RPC, fetching all users and updating manually");

        // Manual backfill
        const { data: users, error: selectError } = await supabase.auth.admin.listUsers();

        if (selectError) {
            console.log("Could not list users via anon key. Will execute purely HTTP API query request to Postgres directly.")
        }

    } catch (e) {
        console.error(e);
    }
}

runSQL();
