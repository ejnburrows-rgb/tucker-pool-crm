import type { VercelRequest } from '@vercel/node';
import type { VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Serverless functions use process.env, not import.meta.env (which is client-side only)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from('clients').select('*').limit(1).single();
    return res.status(200).json({ ok: true, ts: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
