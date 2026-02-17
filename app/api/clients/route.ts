import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const q = searchParams.get('q');

  // Pagination params
  const page = parseInt(searchParams.get('page') || '1');
  const limitStr = searchParams.get('limit');
  const limit = limitStr ? parseInt(limitStr) : null;

  // We request the count so clients can know the total number of records
  // even when paginating.
  let query = supabase.from('clients').select('*', { count: 'exact' });

  // Apply filters
  if (active === 'true') {
    query = query.eq('is_active', true);
  }

  if (q) {
    query = query.ilike('name', `%${q}%`);
  }

  // Apply sorting
  query = query.order('name');

  // Apply pagination only if limit is explicitly provided
  if (limit && !isNaN(limit) && limit > 0) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return data in body, count in header for pagination metadata
  const response = NextResponse.json(data);
  if (count !== null) {
    response.headers.set('X-Total-Count', count.toString());
  }

  return response;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase.from('clients').insert(body).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
