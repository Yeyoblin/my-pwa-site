const CACHE_NAME = 'my-pwa-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/fairies.html',
  '/herbalism.html',
  '/contacts.html',
  '/outdoor.html',
  '/submit_form.php',
  '/site1.png',
  '/site2.png',
  '/images/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если файл есть в кеше — вернём его
        if (response) {
          return response;
        }
        // Если нет — загрузим из сети и добавим в кеш
        return fetch(event.request).then((response) => {
          // Клонируем ответ, т.к. он может быть использован только один раз
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        });
      })
  );
});