self.addEventListener("push", function (event) {

  console.log("PUSH RECEIVED");

  let data = {
    title: "Timeo",
    body: "Nueva notificación"
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.log("Push data error", e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [200, 100, 200],
      tag: "timeo-notification"
    })
  );

});