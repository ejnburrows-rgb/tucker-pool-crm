/* eslint-disable @typescript-eslint/no-unused-vars */
import { performance } from 'perf_hooks';

// Mock Supabase Client
const mockSupabase = {
  from: (_table: string) => {
    return {
      select: (_query: string) => {
        return {
          eq: (_field: string, _value: string) => {
             return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                order: async (_field: string, _options: any) => {
                  // Simulate network delay
                  await new Promise(resolve => setTimeout(resolve, 200));
                  return { data: [{ id: 1, amount: 100 }] };
                }
             }
          }
        }
      }
    }
  }
};

async function runSequential() {
  const start = performance.now();

  // Query 1
  const { data: overduePayments } = await mockSupabase
    .from('payments')
    .select('*, client:clients(id, name, phone, language)')
    .eq('status', 'overdue')
    .order('days_overdue', { ascending: false });

  // Query 2
  const { data: overdueWork } = await mockSupabase
    .from('additional_work')
    .select('*, client:clients(id, name, phone, language)')
    .eq('status', 'overdue')
    .order('work_date', { ascending: true });

  // Use variables to avoid lint errors
  void overduePayments;
  void overdueWork;

  const end = performance.now();
  return end - start;
}

async function runParallel() {
  const start = performance.now();

  const [paymentsResult, workResult] = await Promise.all([
    mockSupabase
      .from('payments')
      .select('*, client:clients(id, name, phone, language)')
      .eq('status', 'overdue')
      .order('days_overdue', { ascending: false }),
    mockSupabase
      .from('additional_work')
      .select('*, client:clients(id, name, phone, language)')
      .eq('status', 'overdue')
      .order('work_date', { ascending: true })
  ]);

  const { data: overduePayments } = paymentsResult;
  const { data: overdueWork } = workResult;

  // Use variables to avoid lint errors
  void overduePayments;
  void overdueWork;

  const end = performance.now();
  return end - start;
}

async function main() {
  console.log('--- Benchmark: Overdue Page Queries ---');

  console.log('Running Sequential (Baseline)...');
  const sequentialTime = await runSequential();
  console.log(`Sequential Time: ${sequentialTime.toFixed(2)}ms`);

  console.log('Running Parallel (Optimized)...');
  const parallelTime = await runParallel();
  console.log(`Parallel Time: ${parallelTime.toFixed(2)}ms`);

  const improvement = ((sequentialTime - parallelTime) / sequentialTime) * 100;
  console.log(`\nImprovement: ${improvement.toFixed(2)}%`);
}

main();
