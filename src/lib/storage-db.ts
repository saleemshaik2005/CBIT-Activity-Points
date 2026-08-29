/**
 * Client-Side IndexedDB & Local Storage Manager for Persistent Certificate Storage
 * 
 * Solves the broken image problem caused by ephemeral blob: URLs or localStorage size limits.
 * Uses browser IndexedDB with seamless fallback to localStorage base64 data URLs.
 */

const DB_NAME = 'CBIT_MAR_STORAGE_DB';
const DB_VERSION = 1;
const STORE_NAME = 'certificates';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };

    request.onerror = (event: any) => {
      reject(event.target.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Stores a certificate file (as base64 or data URL) into IndexedDB
 */
export async function savePersistentCertificate(id: string, dataUrl: string, metadata?: Record<string, any>): Promise<boolean> {
  if (!id || !dataUrl) return false;

  // 1. Try saving into IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        id,
        dataUrl,
        metadata: metadata || {},
        updatedAt: new Date().toISOString(),
      });

      request.onsuccess = () => resolve();
      request.onerror = (e: any) => reject(e.target.error);
    });
    return true;
  } catch (err) {
    console.warn('[Storage DB] IndexedDB write failed, fallback to localStorage cache:', err);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`cbit_cert_${id}`, dataUrl);
      }
      return true;
    } catch (e) {
      console.error('[Storage DB] Storage write completely failed:', e);
      return false;
    }
  }
}

/**
 * Retrieves a certificate file data URL from IndexedDB or localStorage
 */
export async function getPersistentCertificate(id: string): Promise<string | null> {
  if (!id) return null;

  // 1. Try IndexedDB
  try {
    const db = await openDB();
    const result = await new Promise<any>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e: any) => reject(e.target.error);
    });

    if (result && result.dataUrl) {
      return result.dataUrl;
    }
  } catch (err) {
    console.warn('[Storage DB] IndexedDB read failed, trying localStorage:', err);
  }

  // 2. Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      const fallback = localStorage.getItem(`cbit_cert_${id}`);
      if (fallback) return fallback;
    }
  } catch (e) {}

  return null;
}

/**
 * Deletes a stored certificate file
 */
export async function deletePersistentCertificate(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (e: any) => reject(e.target.error);
    });
  } catch (err) {}

  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cbit_cert_${id}`);
    }
  } catch (e) {}

  return true;
}

/**
 * Helper to convert any File / Blob to permanent Base64 Data URL
 */
export function fileToPermanentDataURL(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
