self.addEventListener('push', function (event) {

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log('❌ JSON ERROR', e);
  }

  console.log('📩 PUSH RECIBIDO', data);

  const title = data.title || 'TIMEO';
  const body = data.body || 'SIN CONTENIDO';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon-192.png',
    })
  );
});