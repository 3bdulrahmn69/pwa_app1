const CACHE_NAME = 'mini-games-v2';
// what will saved to cache !

const urlsToCache = [
  './',
  './index.html',
  './api.html',
  './clicker.html',
  './reaction.html',
  './style.css',
  './clicker.js',
  './reaction.js',
  './api.js',
  './icons/icon-96.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon.ico',
  './manifest.json',
  './sw.js',
  './offline-message.json',
];

self.addEventListener('install', (event) => {
  console.log('myApp: installing ...');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('myApp sw: Cache opened - + ', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('myApp SW: All files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('myApp SW: Cached Faild: ', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('myApp: activating ...');

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        console.log('Found Caches: ', keys);
        return Promise.all(
          keys
            .filter((key) => {
              return key != CACHE_NAME;
            })
            .map((key) => {
              console.log('myApp SW: Deleting old caches: ', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('myApp SW: Activation completed ...');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('myApp SW: activation faild: ', error);
      })
  );
});

// Notify user of connection loss
function showConnectionLostMessage() {
  self.registration.showNotification('Connection Lost', {
    body: 'You are offline. Some features may not be available.',
    icon: './icons/icon-192.png',
  });
}

// http request cache !
self.addEventListener('fetch', (event) => {
  console.log('myApp: fetching ..., ', event.request.url);
  const url = new URL(event.request.url);

  if (
    url.protocol === 'chrome-extension:' ||
    url.protocol === 'moz-extension:'
  ) {
    return;
  }

  if (url.hostname === 'jsonplaceholder.typicode.com') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(
            'myApp: this is a serving api response from cache:',
            event.request.url
          );
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            console.log(
              'myApp: API request success, caching response: ',
              event.request.url
            );
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            console.log('myApp: API request failed');
            showConnectionLostMessage();
            if (url.pathname.includes('/posts/')) {
              return caches.match('./offline-message.json');
            }

            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' },
            });
          });
      })
    );
    return;
  }

  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request);
      })
      .catch(() => {
        console.log('Failed to fetch cached content....');
        showConnectionLostMessage();
        return new Response('Offline - SW failed to fetch posts');
      })
  );
});

// const cache new Map()
// cache.set('key', value)
// src/index.js servieWorkerRegitration.register()
