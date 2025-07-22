// const CACHE = "libe-cache-v1";
// self.addEventListener("install", e => {
//   e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html", "./style.css", "./script.js", "./LIBE.jpg", "./manifest.json"])));
// });
// self.addEventListener("fetch", e => {
//   e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
// });
const CACHE_NAME = 'libe-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/LIBE.jpg'
];

// Instalación del SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
});

// Interceptar fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

