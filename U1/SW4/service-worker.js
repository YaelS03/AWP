const CACHE_STATIC = 'sw4-static-v3';
const CACHE_DYNAMIC = 'sw4-dynamic-v3';


const assets = [
  '/SW4/',
  '/SW4/index.html',
  '/SW4/pagina1.html',
  '/SW4/pagina2.html',
  '/SW4/pagina3.html',
  '/SW4/styles.css',
  '/SW4/main.js',
  '/SW4/imagen1.jpg',
  '/SW4/imagen2.jpeg',
  '/SW4/imagen3.jpg',
  '/SW4/logo.png'
];

// Precargar los assets
self.addEventListener('install', event => {
  console.log('SW4: Instalando…');
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('SW4: Cacheando recursos estaticos ');
        return cache.addAll(assets);
      })
  );
  self.skipWaiting();
});

//Eliminar caches anteriores
self.addEventListener('activate', event => {
  console.log('SW4: Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map(key => {
            console.log('SW4: Eliminando cache antiguo →', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

//ESTRATEGIA NETWORK-FIRST + Cache dinámico + Fallback
self.addEventListener('fetch', event => {
  const req = event.request;

  //Evitar errores con extensiones del navegador
  if (req.url.includes('chrome-extension') || req.url.includes('favicon.ico')) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        // Guardar en cache dinamico si la respuesta es correcta
        const resClone = res.clone();
        caches.open(CACHE_DYNAMIC).then(cache => cache.put(req, resClone));
        return res;
      })
      .catch(async () => {
        // Si no hay red: buscar en cache
        const cacheRes = await caches.match(req);
        if (cacheRes) return cacheRes;

        // Si falla una navegacion HTML - cargar index offline
        if (req.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }

        // Ultimo recurso
        return new Response("Offline", { status: 503 });
      })
  );
});

// Notificaciones locales (backup por si se usa messaging)
self.addEventListener('message', (event) => {
  if (event.data === 'mostrar-notificacion') {
    self.registration.showNotification('Stranger Things', {
      body: '¡Bienvenido al Upside Down!',
      icon: './logo.png',
      vibrate: [200, 100, 200],
      tag: 'st-local'
    });
  }
});

