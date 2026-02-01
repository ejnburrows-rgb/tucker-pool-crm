import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  console.error('Please ensure .env.local exists and contains these variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const EMAIL = 'admin@tuckerpool.com';
const PASSWORD = 'Ejn!79021';

async function seedUser() {
  console.log(`Checking for user: ${EMAIL}...`);

  // Check if user exists by listing users (requires service role)
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError.message);
    process.exit(1);
  }

  const existingUser = users.find(u => u.email === EMAIL);

  if (existingUser) {
    console.log(`User ${EMAIL} already exists. ID: ${existingUser.id}`);
  } else {
    console.log(`Creating user ${EMAIL}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error.message);
      process.exit(1);
    }

    console.log(`User created successfully! ID: ${data.user.id}`);
    console.log(`Password: ${PASSWORD}`);
  }
}

seedUser();
