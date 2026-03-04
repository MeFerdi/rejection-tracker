// Strategy: Cache-first for assets, Network-first for API
// Offline fallback for full shell availability
// ─────────────────────────────────────────────

const CACHE_NAME = "rejection-tracker-v1";
const RUNTIME_CACHE = "rejection-tracker-runtime-v1";

// Workbox injects the versioned asset manifest here at build time.
// This is required by the injectManifest strategy — do not remove.
const WB_MANIFEST = self.__WB_MANIFEST || [];

// Core app shell — cache on install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  ...WB_MANIFEST.map((e) => (typeof e === "string" ? e : e.url)),
];

// ── Install: precache app shell ──────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ───────────────
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !currentCaches.includes(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-first for assets, fallback to network ──
self.addEventListener("fetch", (event) => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // For navigation requests, serve index.html (SPA fallback)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match("/index.html")
      )
    );
    return;
  }

  // Cache-first strategy for static assets (JS, CSS, fonts, icons)
  if (
    event.request.destination === "script" ||
    event.request.destination === "style" ||
    event.request.destination === "font" ||
    event.request.destination === "image" ||
    event.request.url.includes("/assets/")
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) =>
            cache.put(event.request, clone)
          );
          return response;
        });
      })
    );
    return;
  }

  // Network-first for everything else, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── Background Sync: queue pending writes ────
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-applications") {
    event.waitUntil(syncApplications());
  }
});

async function syncApplications() {
  // Placeholder for future backend sync
  console.log("[SW] Background sync triggered for applications");
}

// ── Push Notifications (milestone alerts) ────
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? "1000 Challenge";
  const options = {
    body: data.body ?? "Keep going. Every application counts.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-96.png",
    tag: "milestone",
    renotify: true,
    data: { url: data.url ?? "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url ?? "/")
  );
});