self.addEventListener("install", (event) => {
  event.waitUntil(
      caches.open("my-cache").then((cache) => {
          return cache.addAll([
              "./",
              "./index.html",
              "./css/style.css",
              "./js/script.js",
              "./img/icon.png",
          ]).catch((error) => {
              console.error('Failed to add resources to cache:', error);
          });
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          return response || fetch(event.request);
      }).catch((error) => {
          console.error('Error fetching resource from cache:', error);
      })
  );
});