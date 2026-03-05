const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpmwfjzpuztjpmozsbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcG13Zmp6cHV6dGpwbW96c2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTE5NzAsImV4cCI6MjA4Njk4Nzk3MH0.O6old49sQ9vTh4QBVxvQ2aoPH0iOHymINlYvGGX7qP8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTrigger() {
    console.log("Creating test user to check trigger...");

    // Some supabase instances block example.com or require real domains
    const email = `test-${Date.now()}@nationalcleaningnetwork.com`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: 'password123!',
        options: {
            data: {
                firstName: 'Trigger',
                lastName: 'Test',
                phone: '1234567890',
                companyName: 'Test Corp',
                companyNumber: '123',
                officeAddress: '123 Test St',
                insurerName: 'Test Insure',
                awards: 'Test Awards',
                serviceTypes: ['Commercial', 'Residential'],
                otherService: '',
                baseLocation: 'London',
                serviceRadius: 50,
                insuranceDocUrl: 'test.pdf',
            },
        },
    });

    if (authError) {
        console.error("Auth Error:", authError);
        return;
    }

    console.log("Signup success:", authData.user?.id);

    if (authData.user) {
        // Since we are unauthenticated, we have to login to check our own profile 
        // because of the RLS policy!
        const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
            email,
            password: 'password123!'
        });

        if (loginErr) {
            console.error("Login failed (perhaps email confirmation required?):", loginErr);
            return;
        }

        const { data: cleaner, error: cleanerError } = await supabase
            .from('cleaners')
            .select('*')
            .eq('user_id', authData.user?.id)
            .single();

        console.log("Cleaner Trigger Result:", { cleaner, cleanerError });
    }
}

testTrigger();
