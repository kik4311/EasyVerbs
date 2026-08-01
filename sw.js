// EasyVerbs
// Copyright (C) 2026 kik4311
// This program is free software under GPL v3 - see LICENSE

const CACHE = 'easyverbs-v0.5.3';
const URLS = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'translations.js',
  'manifest.json',
  'logo.svg',
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
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(resp) {
        if (!resp || resp.status !== 200) return resp;
        return caches.open(CACHE).then(function(cache) {
          cache.put(event.request, resp.clone());
          return resp;
        });
      }).catch(function() {
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
