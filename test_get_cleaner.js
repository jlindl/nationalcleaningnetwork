const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpmwfjzpuztjpmozsbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcG13Zmp6cHV6dGpwbW96c2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTE5NzAsImV4cCI6MjA4Njk4Nzk3MH0.O6old49sQ9vTh4QBVxvQ2aoPH0iOHymINlYvGGX7qP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const { data: { user } } = await supabase.auth.signInWithPassword({
        email: 'alexterry10@hotmail.com', // Let's test with a fake account if possible or just check the table policies
        password: 'password123'
    });

    if (user) {
        console.log("Logged in:", user.id);

        const { data: cleaner, error } = await supabase
            .from('cleaners')
            .select('id')
            .eq('user_id', user.id)
            .single();

        console.log("Cleaner lookup:", { cleaner, error });
    } else {
        console.log("Could not login to test user. Let's just check the DB policies.");

        // Test unauthenticated read (should fail based on our policies)
        const { data: cleaners, error } = await supabase.from('cleaners').select('*').limit(1);
        console.log("Unauth read:", { cleaners, error });
    }
}

test();
