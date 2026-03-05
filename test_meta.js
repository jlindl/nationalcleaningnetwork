const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpmwfjzpuztjpmozsbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcG13Zmp6cHV6dGpwbW96c2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTE5NzAsImV4cCI6MjA4Njk4Nzk3MH0.O6old49sQ9vTh4QBVxvQ2aoPH0iOHymINlYvGGX7qP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserMetadata() {
    console.log("Checking user session...");

    // We can't see other users metadata from JS easily without Service Role.
    // Instead, try to login and read our own user metadata.
    const email = 'alexterry10@hotmail.com'; // Use the exact email that fails

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password123'
    });

    if (authError) {
        console.error("Auth Error (Check your password or if user exists!):", authError.message);
        return;
    }

    console.log("Logged in:", authData.user?.id);
    console.log("User Metadata:", authData.user?.user_metadata);

    // Try to manually insert a row using this metadata to see the exact Postgres error
    console.log("Attempting manual insert to cleaners table...");

    const meta = authData.user?.user_metadata || {};

    const { error: insertError } = await supabase.from('cleaners').insert({
        user_id: authData.user?.id,
        email: authData.user?.email,
        first_name: meta.firstName || 'Missing',
        last_name: meta.lastName || 'Missing',
        phone: meta.phone,
        company_name: meta.companyName || 'Missing',
        company_number: meta.companyNumber,
        office_address: meta.officeAddress,
        insurer_name: meta.insurerName,
        insurance_doc_url: meta.insuranceDocUrl,
        awards: meta.awards || null,
        service_types: meta.serviceTypes || [],
        other_service: meta.otherService || null,
        base_location: meta.baseLocation,
        service_radius: Number(meta.serviceRadius) || 0
    });

    if (insertError) {
        console.error("Manual Insert Failed! Reason:", insertError);
    } else {
        console.log("Manual Insert SUCCEEDED! If this worked, the trigger failed during signup (perhaps because base_location or something was missing previously, or RLS blocked the trigger).");
    }
}

checkUserMetadata();
