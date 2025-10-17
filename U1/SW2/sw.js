// Nombre del cache actual (identificador único)
const CACHE_NAME = "mi-app-cache-v1";

// Lista de archivos que se guardarán en caché (usando rutas absolutas)
const urlsToCache = [
    "./",               // Página principal
    "./index.html",     // Documento raíz
    "./styles.css",     // Hoja de estilos
    "./app.js",         // Script principal
    "./logo.png"        // Imagen/logo
];

// Evento de instalación
self.addEventListener("install", (event) => {
    console.log("SW: Instalado");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("SW: Cacheando archivos...");
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error("SW: Error al cachear archivos:", error);
            })
            
    );
    self.ServiceWorkerRegistration.showNotification("Service Worker Activo."),
    {
        body: "El cahe inicial se configuró correctamente.",
        icon: "/logo.png",
    }

});

// Evento de activación
self.addEventListener("activate", (event) => {
    console.log("SW: Activado");

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Evento de intercepción de peticiones
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Retorna desde cache si está disponible, si no, desde la red
            return response || fetch(event.request);
        })
    );
});
// Para mostrar notificaciones (esto se llama desde tu app principal, no desde el SW)
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    // Aquí puedes manejar el clic en la notificación
    event.waitUntil(
        clients.openWindow('/') // Abre la app principal
    );
});