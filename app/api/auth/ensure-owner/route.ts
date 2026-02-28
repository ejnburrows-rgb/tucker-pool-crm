import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const OWNER_EMAIL = 'rodeanddavid@yahoo.com';
const OWNER_PASSWORD = 'Ejn!79021';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server auth configuration missing' }, { status: 500 });
  }

  const { email, password } = await request.json();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (normalizedEmail !== OWNER_EMAIL || password !== OWNER_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized bootstrap request' }, { status: 403 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { data: usersData, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const existingUser = usersData.users.find(
    (user) => user.email?.toLowerCase() === OWNER_EMAIL
  );

  if (existingUser) {
    const { error: updateError } = await admin.auth.admin.updateUserById(existingUser.id, {
      password: OWNER_PASSWORD,
      email_confirm: true,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: 'updated' });
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email: OWNER_EMAIL,
    password: OWNER_PASSWORD,
    email_confirm: true,
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, action: 'created' });
}
