// Cabina — service worker: tutto in cache, funziona senza rete.
const CACHE = "cabina-767c16165d";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("cabina-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// prima la cache (subito, anche offline); la pagina nuova arriva con la nuova versione del service worker
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
});
