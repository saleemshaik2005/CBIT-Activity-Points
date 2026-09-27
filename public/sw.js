// Service Worker for CBIT Student Portfolio Management System (SPMS) PWA
const CACHE_NAME = 'cbit-spms-v3';

const APP_SHELL_ROUTES = [
  '/',
  '/login',
  '/student',
  '/student/upload',
  '/student/history',
  '/settings',
  '/mentor',
  '/admin',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/cbit-crest.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache each route individually so a single 404 never aborts the entire install
      await Promise.allSettled(
        APP_SHELL_ROUTES.map((url) =>
          fetch(url, { credentials: 'same-origin' })
            .then((res) => {
              if (res && res.ok) {
                return cache.put(url, res);
              }
            })
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension')) {
    return;
  }

  const url = new URL(request.url);

  // 1. Offline-safe caching for /api/sync GET so AppContext works offline
  if (url.pathname === '/api/sync') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ offline: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // Let other API endpoints go to network
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. HTML Page Navigations: Network-First -> Cache Update -> Offline Route/Shell Fallback
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(url.pathname, clone.clone());
              cache.put(request, clone);
            });
          }
          return res;
        })
        .catch(async () => {
          const exactMatch =
            (await caches.match(request)) ||
            (await caches.match(url.pathname));
          if (exactMatch) return exactMatch;

          // Fallback to cached /student or / shell so client-side router hydrates cleanly
          return (
            (await caches.match('/student')) ||
            (await caches.match('/')) ||
            new Response(
              '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CBIT SPMS Offline</title></head><body style="font-family:sans-serif;padding:2rem;text-align:center"><h2>CBIT SPMS Offline Mode</h2><p>Your session is saved locally. Reconnect or return to the dashboard.</p><a href="/student" style="color:#385529;font-weight:bold">Open Student Dashboard</a></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            )
          );
        })
    );
    return;
  }

  // 3. Static Assets (_next/static, images, fonts, icons): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && url.origin === self.location.origin) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});

