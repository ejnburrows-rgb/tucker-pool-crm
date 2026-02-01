import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // PR COMMENT [SECURITY]: Using SUPABASE_SERVICE_ROLE_KEY bypasses Row Level Security (RLS).
  // This is dangerous if used for user-facing actions.
  // RECOMMENDATION: Use @supabase/ssr with createServerClient and proper cookie handling for authenticated user actions.
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
