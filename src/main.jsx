import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/* -----------------------------
   SERVICE WORKER
----------------------------- */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("/sw-test.js")
      .then(reg => {

        console.log("✅ SERVICE WORKER REGISTERED");
        console.log(reg);

      })
      .catch(err => {

        console.error("❌ SERVICE WORKER ERROR", err);

      });

  });

}