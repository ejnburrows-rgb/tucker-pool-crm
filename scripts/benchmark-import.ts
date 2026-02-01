
async function benchmark() {
  const itemCount = 50;
  const simulatedLatency = 50; // ms

  const data = Array.from({ length: itemCount }, (_, i) => ({
    name: `Client ${i}`,
    phone: `123-456-${i.toString().padStart(4, '0')}`,
  }));

  const mockSupabase = {
    from: (_table: string) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      insert: async (_payload: any) => {
        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, simulatedLatency));
        return { error: null };
      },
    }),
  };

  console.log(`Starting benchmark with ${itemCount} items and ${simulatedLatency}ms latency per request...`);

  // Scenario 1: Sequential
  console.log('\n--- Scenario 1: Sequential Insert ---');
  const startSeq = performance.now();
  for (const item of data) {
    await mockSupabase.from('clients').insert(item);
  }
  const endSeq = performance.now();
  const seqTime = (endSeq - startSeq).toFixed(2);
  console.log(`Sequential time: ${seqTime}ms`);

  // Scenario 2: Bulk
  console.log('\n--- Scenario 2: Bulk Insert ---');
  const startBulk = performance.now();
  await mockSupabase.from('clients').insert(data);
  const endBulk = performance.now();
  const bulkTime = (endBulk - startBulk).toFixed(2);
  console.log(`Bulk time: ${bulkTime}ms`);

  // Summary
  console.log('\n--- Summary ---');
  const improvement = (parseFloat(seqTime) / parseFloat(bulkTime)).toFixed(2);
  console.log(`Improvement: ${improvement}x faster`);
}

benchmark().catch(console.error);
