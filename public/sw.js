self.addEventListener("push", event => {

  self.registration.showNotification("DEBUG", {
    body: "El evento push llegó al SW"
  });

});