// Einfacher Offline-Cache: erst Netzwerk (damit Updates ankommen), sonst Cache.
const CACHE = 'cafe-kasse-v2';
const FILES = ['./', './index.html', './manifest.json', './geld.js', './icon-180.png', './icon-512.png',
  './schriften/andika-400.woff2', './schriften/andika-700.woff2', './schriften/grandstander.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
