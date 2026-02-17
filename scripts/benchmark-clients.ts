import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { performance } from 'perf_hooks';

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

const TARGET_COUNT = 1000;

async function ensureClients() {
  const { count, error } = await supabase.from('clients').select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting clients:', error.message);
    process.exit(1);
  }

  console.log(`Current client count: ${count}`);

  if ((count || 0) < TARGET_COUNT) {
    const needed = TARGET_COUNT - (count || 0);
    console.log(`Seeding ${needed} additional clients...`);

    const batchSize = 100;
    const batches = Math.ceil(needed / batchSize);

    for (let i = 0; i < batches; i++) {
      const clients = Array.from({ length: Math.min(batchSize, needed - i * batchSize) }, (_, j) => ({
        name: `Benchmark Client ${(count || 0) + i * batchSize + j}`,
        phone: '555-0123',
        address: '123 Test Lane',
        city: 'Testville',
        service_day: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][j % 5],
        monthly_rate: 100 + (j % 50),
        pool_type: 'chlorine',
        is_active: true,
        language: 'en'
      }));

      const { error: insertError } = await supabase.from('clients').insert(clients);
      if (insertError) {
        console.error('Error inserting clients:', insertError.message);
        process.exit(1);
      }
      process.stdout.write('.');
    }
    console.log('\nSeeding complete.');
  }
}

async function runBenchmark() {
  await ensureClients();

  console.log('\n--- Baseline (Fetch All) ---');
  const startAll = performance.now();
  const { data: allClients, error: allError } = await supabase.from('clients').select('*');
  const endAll = performance.now();

  if (allError) {
    console.error('Error fetching all clients:', allError.message);
    return;
  }

  console.log(`Fetched ${allClients?.length} clients.`);
  console.log(`Time: ${(endAll - startAll).toFixed(2)}ms`);

  console.log('\n--- Optimized (Fetch Limit 50) ---');
  const startLimit = performance.now();
  const { data: limitedClients, error: limitError } = await supabase.from('clients').select('*').limit(50);
  const endLimit = performance.now();

  if (limitError) {
    console.error('Error fetching limited clients:', limitError.message);
    return;
  }

  console.log(`Fetched ${limitedClients?.length} clients.`);
  console.log(`Time: ${(endLimit - startLimit).toFixed(2)}ms`);

  const improvement = (endAll - startAll) / (endLimit - startLimit);
  console.log(`\nImprovement Factor: ${improvement.toFixed(2)}x faster`);
}

runBenchmark();
