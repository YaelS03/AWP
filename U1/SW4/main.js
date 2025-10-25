//Verificar soporte de Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/AWP/U1/SW4/service-worker.js')
        .then(reg => console.log("Service Worker registrado:", reg))
        .catch(err => console.log("Error al registrar el SW:", err));
}

//Verificar si el SW controla la página
document.addEventListener("DOMContentLoaded", () => {
    if (navigator.serviceWorker.controller) {
        console.log("El SW está activo y controlando la página.");
    } else {
        console.log("El SW aún no controla la página.");
    }
});

//Solicitar permiso de notificaciones
document.getElementById("btnPermitir").addEventListener("click", () => {
    Notification.requestPermission().then((permiso) => {
        alert("Permiso: " + permiso);
    });
});

//Mostrar notificación local
document.getElementById("btnMostrar").addEventListener("click", async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
        reg.showNotification("Stranger Things", {
            body: "¡Bienvenido al Upside Down!",
            icon: "./logo.png",
            vibrate: [200, 100, 200]
        });
    } else {
        alert("El SW no está registrado aún");
    }
});
