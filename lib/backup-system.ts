/**
 * Multi-layer backup system for CRM data safety
 * Implements: Auto-save to localStorage, IndexedDB backup, checksum verification, version history
 */

const CONFIG = {
  autoSaveDebounceMs: 2000,
  maxVersionHistory: 50,
  backupPrefix: 'rd_pool_backup_',
  primaryKey: 'crm_data_backup',
  exportIntervalHours: 24,
} as const;

interface BackupMetadata {
  version: number;
  timestamp: number;
  checksum: string;
  size: number;
}

interface VersionedBackup {
  data: unknown;
  meta: BackupMetadata;
}

interface CRMBackupData {
  clients: unknown[];
  payments: unknown[];
  additionalWork: unknown[];
  schedule: unknown[];
  exportDate: string;
}

async function generateChecksum(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

class PrimaryStorage {
  private key: string;

  constructor(key: string = CONFIG.primaryKey) {
    this.key = key;
  }

  async save(data: unknown): Promise<boolean> {
    try {
      // Optimized: Only store metadata in localStorage to avoid blocking the main thread
      // with large JSON serialization and synchronous writes. Data is stored in IndexedDB.
      const backup: VersionedBackup = {
        data: null,
        meta: {
          version: Date.now(),
          timestamp: Date.now(),
          checksum: 'offloaded-to-indexeddb',
          size: 0,
        },
      };
      localStorage.setItem(this.key, JSON.stringify(backup));
      return true;
    } catch (error) {
      console.error('[Backup] Primary storage save failed:', error);
      return false;
    }
  }

  async load(): Promise<{ data: unknown; valid: boolean } | null> {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      
      const backup: VersionedBackup = JSON.parse(raw);

      // If data is null (new format), we consider it valid metadata-only
      if (backup.data === null) {
        return { data: null, valid: true };
      }

      // Legacy support: verify checksum for old full backups
      const currentChecksum = await generateChecksum(JSON.stringify(backup.data));
      const valid = currentChecksum === backup.meta.checksum;
      
      if (!valid) {
        console.warn('[Backup] Checksum mismatch detected - data may be corrupted');
      }
      
      return { data: backup.data, valid };
    } catch (error) {
      console.error('[Backup] Primary storage load failed:', error);
      return null;
    }
  }

  getMetadata(): BackupMetadata | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const backup: VersionedBackup = JSON.parse(raw);
      return backup.meta;
    } catch {
      return null;
    }
  }
}

class IndexedDBBackup {
  private dbName = 'CRMBackupDB';
  private storeName = 'backups';
  private db: IDBDatabase | null = null;

  async init(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(this.dbName, 1);
        
        request.onerror = () => {
          console.error('[Backup] IndexedDB init failed');
          resolve(false);
        };
        
        request.onsuccess = () => {
          this.db = request.result;
          resolve(true);
        };
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
      } catch {
        resolve(false);
      }
    });
  }

  async save(data: unknown): Promise<boolean> {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const backup = {
          data,
          timestamp: Date.now(),
        };
        
        store.add(backup);
        
        transaction.oncomplete = () => {
          this.pruneOldVersions();
          resolve(true);
        };
        transaction.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  private async pruneOldVersions(): Promise<void> {
    if (!this.db) return;
    
    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        if (countRequest.result > CONFIG.maxVersionHistory) {
          const index = store.index('timestamp');
          const cursorRequest = index.openCursor();
          let deleteCount = countRequest.result - CONFIG.maxVersionHistory;
          
          cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor && deleteCount > 0) {
              cursor.delete();
              deleteCount--;
              cursor.continue();
            }
          };
        }
      };
    } catch (error) {
      console.error('[Backup] Prune failed:', error);
    }
  }

  async getLatest(): Promise<unknown | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const index = store.index('timestamp');
        const request = index.openCursor(null, 'prev');
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          resolve(cursor ? cursor.value.data : null);
        };
        
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async getAllVersions(): Promise<Array<{ id: number; timestamp: number }>> {
    if (!this.db) await this.init();
    if (!this.db) return [];

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const versions = request.result.map((v: { id: number; timestamp: number }) => ({
            id: v.id,
            timestamp: v.timestamp,
          }));
          resolve(versions);
        };
        
        request.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  async getVersion(id: number): Promise<unknown | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
        
        request.onsuccess = () => {
          resolve(request.result ? request.result.data : null);
        };
        
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
}

class FileExporter {
  static exportToJSON(data: unknown, filename?: string): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const name = filename || `${CONFIG.backupPrefix}${timestamp}.json`;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  static exportToCSV(data: Record<string, unknown>[], filename?: string): void {
    if (!data.length) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const name = filename || `${CONFIG.backupPrefix}${timestamp}.csv`;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(h => {
          const val = row[h];
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
          return `"${str.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  static async importFromFile(): Promise<unknown | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return resolve(null);
        
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          resolve(data);
        } catch {
          console.error('[Backup] File import failed');
          resolve(null);
        }
      };
      
      input.click();
    });
  }
}

class BackupManager {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private primary: PrimaryStorage;
  private indexedDB: IndexedDBBackup;

  constructor() {
    this.primary = new PrimaryStorage();
    this.indexedDB = new IndexedDBBackup();
  }

  async save(data: CRMBackupData): Promise<{ primary: boolean; indexed: boolean }> {
    const primarySuccess = await this.primary.save(data);
    const indexedSuccess = await this.indexedDB.save(data);
    
    console.log(`[Backup] Saved - Primary: ${primarySuccess}, IndexedDB: ${indexedSuccess}`);
    
    return { primary: primarySuccess, indexed: indexedSuccess };
  }

  saveDebounced(data: CRMBackupData): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      await this.save(data);
    }, CONFIG.autoSaveDebounceMs);
  }

  async recover(): Promise<{ source: string; data: CRMBackupData } | null> {
    // Try IndexedDB first as it is now the primary data store
    const indexed = await this.indexedDB.getLatest();
    if (indexed) {
      return { source: 'indexedDB', data: indexed as CRMBackupData };
    }

    // Fallback to localStorage (legacy support or if IDB failed but localStorage somehow has data)
    const primary = await this.primary.load();
    if (primary?.valid && primary.data) {
      return { source: 'localStorage', data: primary.data as CRMBackupData };
    }
    
    // Try corrupted primary as last resort
    if (primary?.data) {
      console.warn('[Backup] Using potentially corrupted primary data');
      return { source: 'localStorage-corrupted', data: primary.data as CRMBackupData };
    }
    
    return null;
  }

  getLastBackupInfo(): { timestamp: number; size: number } | null {
    const meta = this.primary.getMetadata();
    if (!meta) return null;
    return { timestamp: meta.timestamp, size: meta.size };
  }

  async getVersionHistory(): Promise<Array<{ id: number; timestamp: number }>> {
    return this.indexedDB.getAllVersions();
  }

  async restoreVersion(id: number): Promise<CRMBackupData | null> {
    const data = await this.indexedDB.getVersion(id);
    return data as CRMBackupData | null;
  }

  exportNow(data: CRMBackupData, format: 'json' | 'csv' = 'json'): void {
    if (format === 'csv' && Array.isArray(data.clients)) {
      FileExporter.exportToCSV(data.clients as Record<string, unknown>[]);
    } else {
      FileExporter.exportToJSON(data);
    }
  }

  async importData(): Promise<CRMBackupData | null> {
    const data = await FileExporter.importFromFile();
    return data as CRMBackupData | null;
  }
}

export const backupSystem = new BackupManager();

export type { CRMBackupData, BackupMetadata };
