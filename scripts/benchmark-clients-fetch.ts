
import { performance } from 'perf_hooks';

// Mock Client type to match database schema
interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  gate_code: string | null;
  service_day: string;
  monthly_rate: number;
  pool_type: string;
  is_active: boolean;
  language: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const TOTAL_ITEMS = 10000;
const PAGE_SIZE = 12;

function generateData(count: number): Client[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `client-${i}`,
    name: `Client ${i}`,
    phone: `555-000-${String(i).padStart(4, '0')}`,
    address: `${i} Main St`,
    city: 'Pool City',
    gate_code: null,
    service_day: 'monday',
    monthly_rate: 100 + (i % 50),
    pool_type: 'chlorine',
    is_active: i % 2 === 0,
    language: 'en',
    notes: 'Some notes here '.repeat(10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function measure(name: string, fn: () => any) {
  const start = performance.now();
  const startMem = process.memoryUsage().heapUsed;
  const result = fn();
  const endMem = process.memoryUsage().heapUsed;
  const end = performance.now();

  const memDiff = (endMem - startMem) / 1024 / 1024; // MB
  const timeDiff = end - start;

  console.log(`[${name}]`);
  console.log(`  Time: ${timeDiff.toFixed(4)}ms`);
  console.log(`  Memory Delta: ${memDiff.toFixed(4)} MB`);

  return result;
}

console.log('--- Benchmark: Client Fetching Strategy ---\n');

// 1. Simulate Unbounded Fetch (Current Implementation)
// In a real app, Supabase/Postgres fetches all rows, serializes to JSON,
// sends over network, Node parses JSON, stores in memory.
// We simulate the memory cost of holding the full dataset.

console.log(`Generating ${TOTAL_ITEMS} clients...`);
const fullDataset = generateData(TOTAL_ITEMS);
const fullJson = JSON.stringify(fullDataset); // Simulate network payload size

console.log(`Payload Size: ${(fullJson.length / 1024 / 1024).toFixed(2)} MB\n`);

measure('Baseline: Process All Clients (Unbounded)', () => {
  // Simulate parsing the full JSON response
  const data = JSON.parse(fullJson);
  // Simulate React rendering iteration (mapping over all items)
  // Even if we don't render all, the array exists in memory
  return data.length;
});

console.log('\n');

// 2. Simulate Paginated Fetch (Optimized Implementation)
// Database only returns PAGE_SIZE items.
const paginatedDataset = generateData(PAGE_SIZE);
const paginatedJson = JSON.stringify(paginatedDataset);

measure('Optimized: Process Page 1 (Paginated)', () => {
  // Simulate parsing the small JSON response
  const data = JSON.parse(paginatedJson);
  return data.length;
});

console.log('\n--- Summary ---');
console.log('Pagination drastically reduces memory pressure and parsing time,');
console.log('especially as the dataset grows. This prevents server OOM errors');
console.log('and improves response times for the user.');
