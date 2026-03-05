const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpmwfjzpuztjpmozsbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcG13Zmp6cHV6dGpwbW96c2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTE5NzAsImV4cCI6MjA4Njk4Nzk3MH0.O6old49sQ9vTh4QBVxvQ2aoPH0iOHymINlYvGGX7qP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
    console.log("Attempting to login with a user that exists but gets redirected...");

    // Attempt login with your specific email to see what the API returns 
    // for the exact user that is failing for you.
    const email = 'alexterry10@hotmail.com';

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password123'
    });

    if (authError) {
        console.error("Auth Error (Check your password or if user exists!):", authError.message);

        // Let's also check if we can see them via admin or if they have a cleaner row at all 
        // using the error to mean we can't login, but we'll try an unauth insert to onboarding_leads 
        // just to verify the connection is good.
    } else {
        console.log("Login success! User ID:", authData.user?.id);

        // Exact logic from login/page.tsx
        const { data: cleaner, error: cleanerError } = await supabase
            .from('cleaners')
            .select('id, first_name, last_name, company_name')
            .eq('user_id', authData.user?.id)
            .single();

        console.log("Cleaner Profile Found?:", { cleaner, cleanerError });
        if (!cleaner) {
            console.log("No cleaner profile found. The exact symptom you described! Redirecting to /onboarding");
        } else {
            console.log("Cleaner profile exists! Redirecting to /dashboard");
        }
    }
}

testLogin();
