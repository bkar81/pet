// PET Service Worker
// Version: v2.1
// Handles offline caching and detects new PET versions.

const CACHE_NAME = "pet-cache-v2.1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];


// ============================================================
// INSTALL
// ============================================================

self.addEventListener("install", (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then((cache) => {
        return cache.addAll(ASSETS);
      })

      // Activate the new service worker immediately.
      .then(() => {
        return self.skipWaiting();
      })

  );

});


// ============================================================
// ACTIVATE
// ============================================================

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys()

      .then((cacheNames) => {

        return Promise.all(

          cacheNames

            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })

            .map((cacheName) => {
              return caches.delete(cacheName);
            })

        );

      })

      // Take control of currently open PET pages.
      .then(() => {
        return self.clients.claim();
      })

  );

});


// ============================================================
// UPDATE BUTTON SUPPORT
// ============================================================
//
// The "Update" button inside PET sends this message to the
// waiting service worker.
//
// ============================================================

self.addEventListener("message", (event) => {

  if (
    event.data &&
    event.data.type === "SKIP_WAITING"
  ) {

    self.skipWaiting();

  }

});


// ============================================================
// FETCH
// ============================================================

self.addEventListener("fetch", (event) => {

  const url = new URL(event.request.url);


  // ----------------------------------------------------------
  // Do NOT intercept Google services.
  // Google Drive, Google Sheets and Google Sign-In must always
  // communicate directly with Google's servers.
  // ----------------------------------------------------------

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

    caches.match(event.request)

      .then((cachedResponse) => {


        // ----------------------------------------------------
        // PET APP SHELL
        // ----------------------------------------------------
        //
        // For index.html and the PET root:
        //
        //     Network first
        //          ↓
        //     Update cache
        //          ↓
        //     If offline → use cached version
        //
        // This allows PET to detect newly published versions.
        // ----------------------------------------------------

        const isAppShell =
          url.pathname.endsWith("/index.html") ||
          url.pathname.endsWith("/") ||
          url.pathname.endsWith("/pet");


        if (isAppShell) {

          return fetch(event.request)

            .then((networkResponse) => {

              if (
                networkResponse &&
                networkResponse.status === 200
              ) {

                const responseClone =
                  networkResponse.clone();

                caches.open(CACHE_NAME)
                  .then((cache) => {

                    cache.put(
                      event.request,
                      responseClone
                    );

                  });

              }

              return networkResponse;

            })

            // If there is no network, use cached PET.
            .catch(() => {

              return cachedResponse;

            });

        }


        // ----------------------------------------------------
        // OTHER PET RESOURCES
        // ----------------------------------------------------
        //
        // Cache first for other resources.
        // If they aren't cached, get them from the network.
        //
        // ----------------------------------------------------

        if (cachedResponse) {

          return cachedResponse;

        }


        return fetch(event.request)

          .then((networkResponse) => {

            if (
              networkResponse &&
              networkResponse.status === 200
            ) {

              const responseClone =
                networkResponse.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {

                  cache.put(
                    event.request,
                    responseClone
                  );

                });

            }

            return networkResponse;

          });

      })

  );

});
