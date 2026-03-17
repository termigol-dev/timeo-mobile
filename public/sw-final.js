self.addEventListener('install', event => {
  console.log('SW instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('SW activado');
  return self.clients.claim();
});

self.addEventListener('push', function (event) {

  console.log('📩 PUSH RECIBIDO');

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log('❌ JSON ERROR', e);
  }

  console.log('📦 DATA:', data);

  const title = data.title || 'TIMEO';
  const body = data.body || 'SIN CONTENIDO';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon-192.png',
    })
  );
});