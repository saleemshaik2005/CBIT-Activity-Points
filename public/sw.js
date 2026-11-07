// Service Worker for CBIT Student Portfolio Management System (SPMS) PWA
const CACHE_NAME = 'cbit-spms-v4';

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

  // Never cache dynamic API endpoints containing student records or sessions
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

// 4. Web Push Notification Handlers
self.addEventListener('push', (event) => {
  let data = {
    title: 'CBIT SPMS Notification',
    body: 'You have a new update regarding your certificate submissions.',
    url: '/student/history',
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag || 'cbit-spms-notification',
    renotify: true,
    data: {
      url: data.url || '/student/history',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus if already open, else open new window
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
