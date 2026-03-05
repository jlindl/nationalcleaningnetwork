const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpmwfjzpuztjpmozsbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcG13Zmp6cHV6dGpwbW96c2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTE5NzAsImV4cCI6MjA4Njk4Nzk3MH0.O6old49sQ9vTh4QBVxvQ2aoPH0iOHymINlYvGGX7qP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser() {
    console.log("Testing specific user provided by admin...");
    const email = 'jacklindo31@icloud.com';
    const password = 'Rugby2005!';

    // 1. Can we login?
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (authError) {
        console.error("Login Failed:", authError.message);
        return;
    }

    console.log("Login Success! Auth UUID:", authData.user?.id);
    console.log("Auth Metadata:", authData.user?.user_metadata);

    // 2. Query cleaners using exact same query as dashboard
    const { data: cleaner, error: cleanerError } = await supabase
        .from('cleaners')
        .select('*')
        .eq('user_id', authData.user?.id)
        .limit(1)
        .maybeSingle();

    console.log("\n=====================");
    console.log("CLEANERS TABLE QUERY:");
    console.log("=====================");
    console.log("Error? ", cleanerError);
    if (cleaner) {
        console.log("Found profile with ID:", cleaner.id);
        console.log("Name associated:", cleaner.first_name, cleaner.last_name);
        console.log("It exists! Dashbaord *should* be finding this.");
    } else {
        console.log("PROFILE NOT FOUND IN TABLE (Or blocked by RLS)");
        console.log("Attempting manual fix for this specific user...");

        const meta = authData.user?.user_metadata || {};

        const { error: insertErr } = await supabase.from('cleaners').insert({
            user_id: authData.user.id,
            email: email,
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

        console.log("Manual Fix Result:", insertErr ? insertErr.message : "SUCCESS - Profile created manually!");
    }
}

checkUser();
