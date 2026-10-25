// PET retirement service worker.
// Phones that installed PET check this file for updates. This version installs straight away,
// deletes PET's own offline caches (only those starting with "pet-cache-", never other apps'),
// removes itself, and sends any open PET window to PIE Tracker.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("pet-cache-")).map((k) => caches.delete(k)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: "window" });
    windows.forEach((w) => w.navigate(w.url.replace(/\/pet(\/|$)/i, "/pie/")));
  })());
});
