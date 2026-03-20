import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    await supabase.from('clients').select('*').limit(1).single();

    return Response.json({ ok: true, ts: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
