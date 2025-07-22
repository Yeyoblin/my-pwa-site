const CACHE_NAME = 'my-pwa-cache-v3';
const BASE_PATH = '/my-pwa-site';

const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/style.css',
  BASE_PATH + '/fairies.html',
  BASE_PATH + '/herbalism.html',
  BASE_PATH + '/contacts.html',
  BASE_PATH + '/outdoor.html',
  BASE_PATH + '/submit_form.php',
  BASE_PATH + '/site1.png',
  BASE_PATH + '/site2.png'
  // Добавьте сюда нужные изображения из /images/ по аналогии:
  // BASE_PATH + '/images/example.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Ошибка кэширования в install:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
          // Проверяем валидность ответа
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        });
      }).catch(() => {
        // Здесь можно вернуть заглушку офлайн-страницы, если есть
      })
  );
});
