export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { createClient } = await import('../../src/lib/supabase/server.js');
    const supabase = createClient();
    await supabase.from('clients').select('*').limit(1).single();
    return res.status(200).json({ ok: true, ts: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
