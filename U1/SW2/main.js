// registrar el Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then((reg) => {
            console.log('SW registrado', reg);
            // Esperar a que el SW este activo
            navigator.serviceWorker.ready.then(() => {
                console.log('SW activo');
            });
        })
        .catch((err) => console.log('Error al registrar el SW', err));
}

// boton para verificar estado del SW
document.getElementById('check').addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
        alert('El SW esta activo');
    } else {
        alert('El SW no esta activo');
    }
});

// pedir permiso de notificacion
if (Notification.permission === 'default') {
    Notification.requestPermission().then((perm) => {
        if (perm === 'granted') console.log('Permiso concedido');
        else console.log('Permiso denegado');
    });
}

// Botón para mostrar notificación
document.getElementById("btnNotificacion").addEventListener('click', () => {
    navigator.serviceWorker.ready.then(() => {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage('mostrar-notificacion');
        } else {
            console.log('El SW no esta activo aun');
        }
    });
});

