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
if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("/sw.js")
    .then(reg => {
      console.log("Service Worker registrado", reg);
    })
    .catch(err => {
      console.error("Error registrando SW", err);
    });

}