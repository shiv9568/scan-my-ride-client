const CACHE_NAME = 'smr-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ✅ Skip ALL API requests and cross-origin requests (e.g. Render backend)
  // Let them go directly to the network without caching
  if (
    event.request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) {
    return; // Don't intercept — let the browser handle it normally
  }

  // Cache-first strategy only for same-origin static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
