/**
 * ==============================================================================
 * CBIT SPMS — Offline Certificate Drafts & IndexedDB Queue
 * ==============================================================================
 * Manages local persistent drafts when internet connectivity is lost,
 * verifies real server connectivity upon reconnection, and ensures students
 * explicitly review documents before final submission.
 * ==============================================================================
 */

import { AIExtractionResult } from '@/types';

export interface OfflineCertificateDraft {
  id: string;
  userId: string;
  studentName: string;
  studentRollNo?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileDataUrl: string; // Base64 data URL for offline rendering
  savedAt: string;
  status: 'offline_draft' | 'reprocessing' | 'ready_for_review';
  analysisResult?: AIExtractionResult;
  errorMessage?: string;
}

const DB_NAME = 'cbit_spms_offline_v1';
const STORE_NAME = 'offline_drafts';

function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Checks actual server/API reachability rather than relying solely on navigator.onLine
 */
export async function checkServerConnectivity(): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  if (!navigator.onLine) return false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('/api/sync', {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Saves a new certificate draft locally in IndexedDB scoped to the authenticated student
 */
export async function saveOfflineDraft(draft: OfflineCertificateDraft): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(draft);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieves all offline drafts belonging to the authenticated student
 */
export async function getUserOfflineDrafts(userId: string): Promise<OfflineCertificateDraft[]> {
  if (!userId) return [];
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('userId');
      const req = index.getAll(userId);

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[Offline Queue] Error loading drafts:', err);
    return [];
  }
}

/**
 * Updates an existing offline draft (e.g., marks reprocessed or stores extraction result)
 */
export async function updateOfflineDraft(
  id: string,
  updates: Partial<OfflineCertificateDraft>
): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      if (!getReq.result) {
        return reject(new Error('Draft not found'));
      }
      const updated = { ...getReq.result, ...updates };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

/**
 * Removes a draft from IndexedDB once confirmed and submitted to the mentor
 */
export async function removeOfflineDraft(id: string): Promise<void> {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Clears all drafts for a specific user upon sign-out to prevent data leakage across student sessions
 */
export async function clearUserOfflineDrafts(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const drafts = await getUserOfflineDrafts(userId);
    const db = await openOfflineDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const d of drafts) {
      store.delete(d.id);
    }
  } catch (err) {
    console.warn('[Offline Queue] Error clearing user drafts:', err);
  }
}
