import React, { useState, useLayoutEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login.jsx';
import DashboardEmployee from './DashboardEmployee.jsx';
import Reports from './admin/Reports.jsx';
import './style.css';

export default function App() {

  const [dark, setDark] = useState(
    localStorage.getItem('dark_mode') === 'true'
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }

    return null;
  });

  useLayoutEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('dark_mode', dark);
  }, [dark]);

  /* -----------------------------
     CONVERTIR VAPID KEY
  ----------------------------- */

  function urlBase64ToUint8Array(base64String) {

    const padding = '='.repeat((4 - base64String.length % 4) % 4);

    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);

    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /* -----------------------------
     LOGIN
  ----------------------------- */

  async function handleLogin(data) {

    console.log("LOGIN RESPONSE:", data);

    const { user, token } = data;

    // 🔥 guardar sesión
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);

    try {

      if (!("serviceWorker" in navigator)) return;

      const registration = await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.log("❌ permiso denegado");
        return;
      }

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log("🆕 creando nueva suscripción");

        const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

      } else {
        console.log("♻️ reutilizando suscripción existente");
      }

      console.log("📦 SUBSCRIPTION:", subscription);

      fetch(`${import.meta.env.VITE_API_URL}/devices/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          token: JSON.stringify(subscription),
          platform: 'WEB'
        })
      })
      .then(res => {
        if (!res.ok) {
          console.error("❌ Device no registrado:", res.status);
          return;
        }
        console.log("📲 DEVICE REGISTRADO");
      })
      .catch(err => {
        console.error("❌ Error device:", err);
      });

    } catch (err) {
      console.error("❌ ERROR PUSH:", err);
    }
  }

  /* -----------------------------
     LOGOUT
  ----------------------------- */

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  /* -----------------------------
     LOGIN SCREEN
  ----------------------------- */

  if (!user) {
    return (
      <Login
        dark={dark}
        setDark={setDark}
        onLogin={handleLogin}
      />
    );
  }

  /* -----------------------------
     APP
  ----------------------------- */

  return (
    <Routes>

      <Route
        path="/"
        element={
          <DashboardEmployee
            user={user}
            dark={dark}
            setDark={setDark}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/reports"
        element={<Reports user={user} />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}