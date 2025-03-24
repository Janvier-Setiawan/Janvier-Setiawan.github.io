const CACHE_NAME = 'pwa-cache-v2'; // Ganti versi cache agar update berjalan
const OFFLINE_PAGE = '/offline.html';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/offline.html',
    '/manifest.json'
];

// Install Service Worker dan cache aset
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(CACHE_ASSETS);
        })
    );
    self.skipWaiting(); // Langsung aktifkan Service Worker
});

// Activate Service Worker dan hapus cache lama
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME) // Hapus cache lama
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim(); // Segera gunakan SW yang baru
});

// Fetch Event Handling
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // 1. Caching untuk API Posts (Network-First)
    if (requestUrl.origin === 'https://jsonplaceholder.typicode.com' && requestUrl.pathname.startsWith('/posts')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    return caches.match(event.request).then(response => 
                        response || new Response('{"error": "Data tidak tersedia offline"}', { headers: { "Content-Type": "application/json" } })
                    );
                })
        );
        return;
    }

    // 2. Cache-First untuk aset statis & halaman
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request)
                .then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
        }).catch(() => {
            // 3. Jika gagal, tampilkan halaman offline untuk navigasi
            if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_PAGE);
            }
        })
    );
});
