import type { VercelRequest } from '@vercel/node';
import type { VercelResponse } from '@vercel/node';
import { createClient } from '../../src/lib/supabase/server';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const supabase = createClient();
    await supabase.from('clients').select('*').limit(1).single();
    return res.status(200).json({ ok: true, ts: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
