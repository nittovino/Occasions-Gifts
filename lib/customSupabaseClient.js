import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bjopvdkawgxkoszxrbfp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqb3B2ZGthd2d4a29zenhyYmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjc2OTgsImV4cCI6MjA4NjkwMzY5OH0.9EmwO-b_fvhdqSFuxy59AtgBWFev87nHaHnlSby63NI';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
