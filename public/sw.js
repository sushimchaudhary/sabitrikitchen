const CACHE_NAME = 'sabitri-kitchen-v4'; // 🌟 v4 संस्करण (पुराना त्रुटिपूर्ण क्यास बर्न गर्न)
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // यहाँ अरू इमेज वा फन्ट छन् भने राख्न सक्नुहुन्छ, तर '/' वा कुनै पनि पेज नराख्नुहोला
];

// १. Install - केवल वास्तविक static assets मात्र क्यास गर्ने (No Pages)
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

// ३. Fetch - बुद्धिमानी नेटवर्क रणनीति
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 🛑 मुख्य फिक्स: रूट, एपीआई, ड्यासबोर्ड र अथलाई क्यासबाट पूर्ण रूपमा बाइपास गरी सिधै नेटवर्कमा पठाउने
  if (
    url.pathname === '/' || 
    url.pathname.startsWith('/dashboard') ||
    url.pathname.includes('/api/') || 
    url.pathname.includes('/auth/')
  ) {
    return event.respondWith(fetch(event.request));
  }

  // 🍏 नियम २: बाँकी रहेका वास्तविक Assets (Icons, Images, Manifest) मात्र क्यासबाट दिने
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // यदि क्यासमा फाइल छ भने त्यहीँबाट दिने (Speed बढाउन)
      }

      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }
        // केवल Static Extention (.png, .json, .css, .js) भएका रिक्वेस्ट मात्र रनटाइममा क्यास गर्ने
        const isStaticFile = /\.(png|jpg|jpeg|gif|svg|ico|json|css|js)$/i.test(url.pathname);
        
        if (isStaticFile) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      }).catch(() => caches.match(event.request))

    })
  );
});