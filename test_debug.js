const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpmwfjzpuztjpmozsbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcG13Zmp6cHV6dGpwbW96c2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTE5NzAsImV4cCI6MjA4Njk4Nzk3MH0.O6old49sQ9vTh4QBVxvQ2aoPH0iOHymINlYvGGX7qP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function determineBug() {
    console.log("Identifying why we are routing to onboarding...");

    // We need to test the EXACT email that you are typing in on the login screen.
    const email = 'alexterry10@hotmail.com'; // Adjust this to the email you are using!
    const password = 'password123'; // Adjust this!

    // 1. Can we login?
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (authError) {
        console.error("Login Failed:", authError.message);
        return;
    }

    console.log("Login Success! User ID:", authData.user?.id);

    // 2. Does a cleaner profile ACTUALLY exist for this user?
    const { data: cleaner, error: cleanerError } = await supabase
        .from('cleaners')
        .select('id, first_name')
        .eq('user_id', authData.user?.id)
        .limit(1)
        .maybeSingle();

    console.log("Cleaner Profile Exists?:", cleaner ? "YES" : "NO");
    console.log("Cleaner Query Error?:", cleanerError);

    if (!cleaner) {
        console.log("The problem is: Your row in the 'cleaners' table does NOT exist for some reason.");
        console.log("Try creating a brand new account from the `/onboarding` page right now and see if the trigger fires correctly this time.");
    } else {
        console.log("The problem is: In React `app/login/page.tsx`, the `router.push('/dashboard')` is failing, or `userType` state is flipping.");
    }
}

determineBug();
