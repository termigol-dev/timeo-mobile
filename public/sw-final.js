// 🔥 IDENTIFICADOR
console.log("🔥 SW TIMEO - VERSION LIMPIA");

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
self.addEventListener('push', event => {

  console.log('🚨 PUSH RECIBIDO');

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log('❌ ERROR JSON', e);
  }

  console.log('📦 DATA:', data);

  const title = data.title || 'TIMEO';
  const body = data.body || 'Notificación recibida';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'timeo',
      renotify: true
    })
  );
});

// =============================
// CLICK
// =============================
self.addEventListener('notificationclick', event => {

  console.log('👆 CLICK');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientsArr => {

        if (clientsArr.length > 0) {
          return clientsArr[0].focus();
        }

        return clients.openWindow('/');
      })
  );
});