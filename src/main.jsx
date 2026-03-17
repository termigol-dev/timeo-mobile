// 🔥 IDENTIFICADOR CLARO (para saber si ES este SW)
console.log("🔥 SW TIMEO CARGADO - VERSION FINAL");

// =============================
// INSTALL
// =============================
self.addEventListener('install', event => {
  console.log('🟢 SW instalado');
  self.skipWaiting();
});

// =============================
// ACTIVATE
// =============================
self.addEventListener('activate', event => {
  console.log('🟢 SW activado');
  event.waitUntil(self.clients.claim());
});

// =============================
// PUSH
// =============================
self.addEventListener('push', function (event) {

  console.log('🚨 PUSH EVENT DISPARADO');

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log('❌ ERROR parseando JSON', e);
  }

  console.log('📦 DATA RECIBIDA:', data);

  const title = data.title || 'TIMEO';
  const body = data.body || 'Notificación recibida';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'timeo-notification', // evita duplicados raros
      renotify: true
    })
  );
});

// =============================
// CLICK EN NOTIFICACIÓN
// =============================
self.addEventListener('notificationclick', function (event) {

  console.log('👆 NOTIFICACIÓN CLICKADA');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {

        if (clientList.length > 0) {
          return clientList[0].focus();
        }

        return clients.openWindow('/');
      })
  );
});