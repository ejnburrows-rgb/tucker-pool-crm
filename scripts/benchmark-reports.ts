/* eslint-disable @typescript-eslint/no-explicit-any */
import { performance } from 'perf_hooks';

// Mock types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Payment = { amount_paid: number; status: string };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Work = { amount_paid: number; status: string };

const ITEM_COUNT = 10000;

function generateData() {
  const clients = Array.from({ length: ITEM_COUNT }, (_, i) => ({
    is_active: i % 2 === 0
  }));
  const payments = Array.from({ length: ITEM_COUNT }, (_, i) => ({
    amount_paid: 100,
    status: ['paid', 'pending', 'overdue'][i % 3]
  }));
  const work = Array.from({ length: ITEM_COUNT }, (_, i) => ({
    amount_paid: 50,
    status: ['completed', 'pending'][i % 2]
  }));

  return { clients, payments, work };
}

function processLegacy({ clients, payments, work }: any) {
  const totalClients = clients.length;
  const activeClients = clients.filter((c: any) => c.is_active).length;

  const totalRevenue = payments.reduce((sum: number, p: any) => sum + Number(p.amount_paid || 0), 0);
  const pendingPayments = payments.filter((p: any) => p.status === 'pending').length;
  const overduePayments = payments.filter((p: any) => p.status === 'overdue').length;
  const paidPayments = payments.filter((p: any) => p.status === 'paid').length;

  const workRevenue = work.reduce((sum: number, w: any) => sum + Number(w.amount_paid || 0), 0);
  const pendingWork = work.filter((w: any) => w.status === 'pending').length;
  const completedWork = work.filter((w: any) => w.status === 'completed').length;

  return {
    totalClients,
    activeClients,
    totalRevenue,
    pendingPayments,
    overduePayments,
    paidPayments,
    workRevenue,
    pendingWork,
    completedWork
  };
}

function processOptimized(data: any) {
  // Simulates receiving the object directly from RPC
  return data;
}

function measure(name: string, fn: () => void) {
  const start = performance.now();
  const startMem = process.memoryUsage().heapUsed;
  fn();
  const endMem = process.memoryUsage().heapUsed;
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(4)}ms, Memory Delta: ${((endMem - startMem) / 1024 / 1024).toFixed(4)}MB`);
}

async function runBenchmark() {
  console.log('Generating mock data...');
  const data = generateData();
  console.log(`Generated ${ITEM_COUNT} items per category.\n`);

  console.log('--- Baseline (Application-side Aggregation) ---');
  measure('Processing Time', () => {
    processLegacy(data);
  });

  // Pre-calculate the result to simulate what DB returns
  const expectedResult = processLegacy(data);

  console.log('\n--- Optimized (Database-side Aggregation) ---');
  measure('Processing Time', () => {
    processOptimized(expectedResult);
  });
}

runBenchmark();
