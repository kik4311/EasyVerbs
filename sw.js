const CACHE = 'irregular-verbs-v1';
const URLS = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'translations.js',
  'manifest.json',
  'logo.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(resp) {
        return caches.open(CACHE).then(function(cache) {
          cache.put(event.request, resp.clone());
          return resp;
        });
      });
    })
  );
});
