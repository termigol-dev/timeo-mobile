self.addEventListener("push", function (event) {

  console.log("PUSH EVENT RECEIVED");

  let data = { title: "Timeo", body: "Push recibido" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png"
    })
  );

});