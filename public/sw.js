self.addEventListener("push", function (event) {

  console.log("🔥 PUSH EVENT RECEIVED");
  console.log("👉 RAW EVENT:", event);

  let data = { title: "Timeo DEBUG", body: "Sin datos" };

  if (event.data) {
    try {
      const text = event.data.text();
      console.log("📩 RAW TEXT:", text);

      data = JSON.parse(text);
      console.log("📦 PARSED JSON:", data);

    } catch (e) {
      console.log("❌ ERROR PARSING:", e);
    }
  } else {
    console.log("⚠️ NO DATA IN EVENT");
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png"
    })
  );

});