self.addEventListener("push", function (event) {

  let text = "NO DATA";

  if (event.data) {
    try {
      text = event.data.text();
    } catch (e) {
      text = "ERROR READING DATA";
    }
  }

  const message = "PUSH DEBUG → " + text;

  self.registration.showNotification("DEBUG TIMEO", {
    body: message,
    icon: "/icon-192.png",
  });

});