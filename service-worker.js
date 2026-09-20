// PET service worker
// Caches the app shell for offline use and supports
// notification of new PET versions.

const CACHE_NAME = "pet-cache-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

// Install the new service worker and cache the latest app shell.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Remove old PET caches and take control of open pages.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Allow the PET app to tell the waiting service worker
// to become active immediately.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never intercept Google API / Google sign-in requests.
  if (
    url.hostname.endsWith("googleapis.com") ||
    url.hostname.endsWith("google.com")
  ) {
    return;
  }

  // Only handle GET requests.
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {

      // For PET's app shell, check the network first.
      // This allows new published versions to be detected promptly.
      const isAppShell =
        url.pathname.endsWith("/index.html") ||
        url.pathname.endsWith("/") ||
        url.pathname.endsWith("/pet");

      const networkFetch = fetch(event.request)
        .then((response) => {

          if (response && response.status === 200) {
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return response;
        })
        .catch(() => cached);

      // App shell: Network first, cached version if offline.
      // Other resources: Cache first, network fallback.
      return isAppShell
        ? networkFetch
        : (cached || networkFetch);
    })
  );
});
