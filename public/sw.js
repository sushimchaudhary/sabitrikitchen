const CACHE_NAME = 'sabitri-kitchen-v2'; // 🌟 संस्करण बढाउनुहोस् (v2) ताकि पुराना क्यास क्लियर होस्
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

// ३. Fetch - बुद्धिमानी नेटवर्क रणनीति
self.addEventListener('fetch', (event) => {
  // GET रिक्वेस्ट मात्र ह्यान्डल गर्ने (POST, PUT, DELETE लाई नछुने)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 🛑 नियम १: API / Auth रिक्वेस्टहरू र ड्यासबोर्ड पेजलाई क्यास कहिल्यै नगर्ने (Bypass Cache)
  if (
    url.pathname.includes('/api/') || 
    url.pathname.includes('/auth/') || 
    url.pathname.startsWith('/dashboard')
  ) {
    // सिधै नेटवर्कबाट मात्र डेटा ल्याउने, क्यासमा केही पनि नराख्ने
    return event.respondWith(fetch(event.request));
  }

  // 🍏 नियम २: बाँकी रहेका Static Assets को लागि मात्र Network First, Fallback to Cache गर्ने
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // यदि रेस्पोन्स सही छैन (Status 200 होइन) भने क्यासमा नराख्ने
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }

        // रेस्पोन्स सुरक्षित छ भने मात्र क्यास अपडेट गर्ने
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => {
        // यदि इन्टरनेट छैन (Offline छ) भने मात्र क्यासबाट डेटा दिने
        return caches.match(event.request);
      })
  );
});