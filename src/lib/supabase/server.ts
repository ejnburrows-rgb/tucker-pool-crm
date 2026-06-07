import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  // Vite uses import.meta.env, not process.env (NEXT_PUBLIC_ is a Next.js pattern)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
