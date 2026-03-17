self.addEventListener("push", function (event) {

  let data = null;

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log("ERROR JSON", e);
  }

  const title = data?.title || "TIMEO FALLBACK";
  const body = data?.body || "SIN BODY";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "/icon-192.png",
    })
  );

});