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
   SERVICE WORKER (solo registro)
----------------------------- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register('/sw-final.js?version=100')
      .then(reg => {
        console.log("✅ SW REGISTERED", reg);
      })
      .catch(err => {
        console.error("❌ SW ERROR", err);
      });
  });
}