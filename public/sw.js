self.addEventListener("push", function (event) {

  console.log("PUSH RECEIVED");

  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "Timeo";

  const options = {
    body: data.body || "Nueva notificación",
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );

});