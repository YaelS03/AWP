// Nombre de la cache
const cacheName = 'mi-cache-v2';

// Archivos a cachear (usar rutas relativas con ./)
const cacheAssets = [
    './index.html',
    './style.css',
    './main.js',
    './pagina1.html',
    './pagina2.html',
    './offline.html',
    './icono.png'
];

// Instalación del SW
self.addEventListener('install', (event) => {
    console.log('SW: Instalado');
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('SW: Cacheando archivos...');
                return cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.log('Error al cachear archivos:', err))
    );
});

// Activación del SW
self.addEventListener('activate', (event) => {
    console.log('SW: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log(`SW: Eliminando cache antigua: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Escuchar mensajes desde la página
self.addEventListener('message', (event) => {
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('Notificación Local', {
            body: 'Esta es una prueba de notificación sin servidor push.',
            icon: './icono.png'
        });
    }
});

// Manejar fetch con fallback offline
self.addEventListener('fetch', (event) => {
    // Ignorar extensiones y favicon
    if (event.request.url.includes('chrome-extension') || event.request.url.includes('favicon.ico')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(cacheName).then((cache) => cache.put(event.request, clone));
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((response) => {
                    return response || caches.match('./offline.html');
                });
            })
    );
});
