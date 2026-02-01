
import { performance } from 'perf_hooks';

interface Payment {
  id: string;
  amount_due: number;
  status: string;
}

const ITEMS_COUNT = 10000;

function generateData(count: number): Payment[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `uuid-${i}`,
    amount_due: Math.random() * 1000,
    status: 'overdue'
  }));
}

async function benchmark() {
  console.log(`Running benchmark with ${ITEMS_COUNT} items...`);

  // 1. Generate Data
  const data = generateData(ITEMS_COUNT);
  const totalAmount = data.reduce((sum, item) => sum + item.amount_due, 0);

  // --- Baseline: Client-side Aggregation ---
  console.log('\n--- Baseline: Fetch All Rows ---');
  global.gc?.();
  const startHeapBaseline = process.memoryUsage().heapUsed;
  const startBaseline = performance.now();

  // Simulate Network Serialization (Server -> Client)
  const jsonPayload = JSON.stringify(data);
  const payloadSize = jsonPayload.length;

  // Simulate Network Deserialization (Client receive)
  const receivedData = JSON.parse(jsonPayload);

  // Client-side processing
  const calculatedSum = receivedData.reduce((sum: number, p: Payment) => sum + Number(p.amount_due), 0);
  const count = receivedData.length;

  const endBaseline = performance.now();
  const endHeapBaseline = process.memoryUsage().heapUsed;

  console.log(`Time: ${(endBaseline - startBaseline).toFixed(2)}ms`);
  console.log(`Payload Size: ${(payloadSize / 1024).toFixed(2)} KB`);
  console.log(`Heap Used Diff: ${((endHeapBaseline - startHeapBaseline) / 1024 / 1024).toFixed(2)} MB`);


  // --- Optimized: Database-side Aggregation ---
  console.log('\n--- Optimized: Database RPC ---');
  global.gc?.();
  const startHeapOpt = process.memoryUsage().heapUsed;
  const startOpt = performance.now();

  // Simulate Database Result (Server -> Client)
  const dbResult = [{ count: ITEMS_COUNT, total_amount: totalAmount }];

  // Simulate Network Serialization
  const jsonPayloadOpt = JSON.stringify(dbResult);
  const payloadSizeOpt = jsonPayloadOpt.length;

  // Simulate Network Deserialization
  const receivedDataOpt = JSON.parse(jsonPayloadOpt);

  // Client-side processing (just reading)
  const calculatedSumOpt = receivedDataOpt[0].total_amount;
  const countOpt = receivedDataOpt[0].count;

  const endOpt = performance.now();
  const endHeapOpt = process.memoryUsage().heapUsed;

  console.log(`Time: ${(endOpt - startOpt).toFixed(2)}ms`);
  console.log(`Payload Size: ${(payloadSizeOpt / 1024).toFixed(2)} KB`);
  console.log(`Heap Used Diff: ${((endHeapOpt - startHeapOpt) / 1024 / 1024).toFixed(2)} MB`);

  // --- Comparison ---
  console.log('\n--- Improvement ---');
  console.log(`Time Reduction: ${((endBaseline - startBaseline) - (endOpt - startOpt)).toFixed(2)}ms`);
  console.log(`Payload Reduction: ${((payloadSize - payloadSizeOpt) / 1024).toFixed(2)} KB (${(payloadSize / payloadSizeOpt).toFixed(0)}x smaller)`);
}

benchmark().catch(console.error);
