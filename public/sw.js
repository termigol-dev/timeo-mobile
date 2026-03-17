self.addEventListener("push", function (event) {

  console.log("📩 PUSH EVENT RAW:", event);

  let data = {
    title: "Notificación",
    body: "Sin contenido"
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log("❌ Error parsing push:", e);
  }

  console.log("📦 PUSH DATA:", data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    })
  );

});