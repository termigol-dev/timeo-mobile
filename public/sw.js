self.addEventListener("push", function (event) {

  console.log("🔥 PUSH EVENT:", event);

  let data;

  try {
    data = event.data ? event.data.json() : null;
  } catch (e) {
    console.log("❌ JSON ERROR", e);
    data = null;
  }

  console.log("📦 DATA:", data);

  const title = data?.title || "TIMEO DEFAULT";
  const body = data?.body || "SIN CONTENIDO";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "/icon-192.png",
    })
  );

});