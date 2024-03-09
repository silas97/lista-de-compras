self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open("my-cache").then((cache) => {
			return cache.addAll([
				"/lista-de-compras/",
				"/lista-de-compras/index.html",
				"/lista-de-compras/css/style.css",
				"/lista-de-compras/js/script.js",
				"/lista-de-compras/img/icon.png",
				"/lista-de-compras/img/favicon.ico",
			]);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
