
import { backupSystem, CRMBackupData } from '../lib/backup-system';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string) { return this.store[key] || null; },
  setItem(key: string, value: string) { this.store[key] = value; },
  removeItem(key: string) { delete this.store[key]; },
  clear() { this.store = {}; }
};
(global as any).localStorage = localStorageMock;

// Mock IndexedDB
// We need to handle the request object statefully
class MockIDBRequest {
  result: any;
  onsuccess: ((e: any) => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  onupgradeneeded: ((e: any) => void) | null = null;

  constructor(result: any) {
    this.result = result;
  }

  triggerSuccess() {
    if (this.onsuccess) {
      this.onsuccess({ target: this });
    }
  }
}

const mockDB = {
  objectStoreNames: { contains: () => true },
  createObjectStore: () => ({ createIndex: () => {} }),
  transaction: (stores: any, mode: any) => {
    const tx = {
      objectStore: (name: string) => ({
        add: (data: any) => {},
        count: () => {
             const req = new MockIDBRequest(0);
             setTimeout(() => req.triggerSuccess(), 0);
             return req;
        },
        index: (name: string) => ({
            openCursor: () => {
                const req = new MockIDBRequest(null); // No cursor, empty DB
                setTimeout(() => req.triggerSuccess(), 0);
                return req;
            }
        }),
        getAll: () => {
             const req = new MockIDBRequest([]);
             setTimeout(() => req.triggerSuccess(), 0);
             return req;
        },
        get: () => {
             const req = new MockIDBRequest(null);
             setTimeout(() => req.triggerSuccess(), 0);
             return req;
        }
      }),
      oncomplete: null as any,
      onerror: null as any,
    };
    // Trigger complete
    setTimeout(() => {
        if (tx.oncomplete) tx.oncomplete();
    }, 0);
    return tx;
  }
};

(global as any).indexedDB = {
  open: (name: string, version: number) => {
    console.log('[Mock] indexedDB.open called');
    const req = new MockIDBRequest(mockDB);
    setTimeout(() => {
        console.log('[Mock] Triggering open success');
        req.triggerSuccess();
    }, 10);
    return req;
  }
};

async function runBenchmark() {
  console.log('Generating large dataset...');
  // Generate ~2MB of data
  const largeData: CRMBackupData = {
    clients: Array.from({ length: 2000 }, (_, i) => ({
      id: i,
      name: `Client ${i}`,
      email: `client${i}@example.com`,
      address: `123 St, City ${i}`,
      notes: 'A'.repeat(1000)
    })),
    payments: [],
    additionalWork: [],
    schedule: [],
    exportDate: new Date().toISOString(),
  };

  const json = JSON.stringify(largeData);
  console.log(`Dataset size: ${(json.length / 1024 / 1024).toFixed(2)} MB`);

  console.log('Running save benchmark...');
  const start = performance.now();
  await backupSystem.save(largeData);
  const end = performance.now();

  console.log(`Total save time: ${(end - start).toFixed(2)} ms`);

  // Verify storage usage
  const stored = localStorage.getItem('crm_data_backup');
  if (stored) {
      console.log(`LocalStorage usage: ${(stored.length / 1024 / 1024).toFixed(2)} MB`);
  } else {
      console.log('LocalStorage usage: 0 MB');
  }
}

runBenchmark().catch(err => {
    console.error('Benchmark failed:', err);
    process.exit(1);
});
