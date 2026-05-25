const CACHE_NAME = 'sabitri-kitchen-v3'; // 🌟 v3 संस्करण (पुराना क्यास बर्न गर्न)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// १. Install - static assets मात्र क्यास गर्ने
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// २. Activate - पुराना क्यासहरू सफा गर्ने
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ३. Fetch - बुद्धिमानी नेटवर्क रणनीति (Bypass Dynamic Routes)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 🛑 मुख्य फिक्स: रूट, API, Auth र ड्यासबोर्डलाई सर्भिस वर्कर क्यासबाट बाइपास गर्ने
  if (
    url.pathname === '/' || 
    url.pathname.startsWith('/dashboard') ||
    url.pathname.includes('/api/') || 
    url.pathname.includes('/auth/')
  ) {
    return event.respondWith(fetch(event.request));
  }

  // 🍏 नियम २: बाँकी रहेका Static Assets मात्र क्यास गर्ने
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});