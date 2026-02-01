
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SIMULATED_LATENCY = 50; // 50ms per request
const ITEM_COUNT = 100;

// Mock Supabase Client
const createMockSupabase = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from: (table: string) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      upsert: async (data: any) => {
        // Simulate network latency
        await delay(SIMULATED_LATENCY);
        // In reality, batch upsert might take slightly longer than single upsert due to payload size,
        // but nowhere near N * latency.
        // We can simulate a tiny overhead for batch if we want, but constant time is a fair approximation for this comparison.
        return { data: null, error: null };
      },
    }),
  };
};

async function runBenchmark() {
  const supabase = createMockSupabase();
  const clients = Array.from({ length: ITEM_COUNT }, (_, i) => ({
    id: `client-${i}`,
    name: `Client ${i}`,
  }));

  console.log(`Starting benchmark with ${ITEM_COUNT} items and ${SIMULATED_LATENCY}ms simulated latency...`);

  // 1. Sequential Benchmark
  const startSequential = performance.now();
  if (clients.length > 0) {
    for (const client of clients) {
      await supabase.from('clients').upsert(client);
    }
  }
  const endSequential = performance.now();
  const sequentialTime = endSequential - startSequential;
  console.log(`Sequential execution time: ${sequentialTime.toFixed(2)}ms`);

  // 2. Batch Benchmark
  const startBatch = performance.now();
  if (clients.length > 0) {
    await supabase.from('clients').upsert(clients);
  }
  const endBatch = performance.now();
  const batchTime = endBatch - startBatch;
  console.log(`Batch execution time: ${batchTime.toFixed(2)}ms`);

  // Results
  const improvement = sequentialTime / batchTime;
  console.log(`\nResults:`);
  console.log(`Batch processing is ${improvement.toFixed(1)}x faster.`);
  console.log(`Time saved: ${((sequentialTime - batchTime) / 1000).toFixed(2)}s`);
}

runBenchmark().catch(console.error);
