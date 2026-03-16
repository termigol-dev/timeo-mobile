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

  const [user, setUser] = useState(null);

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
     SUSCRIPCIÓN A PUSH
  ----------------------------- */

  async function subscribeToPush() {

    if (!("serviceWorker" in navigator)) return null;

    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Push permission denied");
      return null;
    }

    console.log("SUBSCRIBING TO PUSH");

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        )
      });

    }

    console.log("SUBSCRIPTION CREATED", subscription);

    return subscription;
  }

  /* -----------------------------
     LOGIN
  ----------------------------- */

  async function handleLogin(userFromBackend) {

  console.log("LOGIN OK");

  const authToken = localStorage.getItem('token');

  try {

    const subscription = await subscribeToPush();

    if (!subscription) {
      console.log("NO SUBSCRIPTION");
      setUser(userFromBackend);
      return;
    }

    console.log("PUSH SUBSCRIPTION:", subscription);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/devices/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        token: JSON.stringify(subscription),
        platform: 'WEB'
      })
    });

    const data = await res.json();

    console.log("DEVICE REGISTERED:", data);

    // 👇 IMPORTANTE: solo ahora activamos la app
    setUser(userFromBackend);

  } catch (err) {

    console.error("DEVICE REGISTER ERROR:", err);
    setUser(userFromBackend);

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
        element={
          <Reports user={user} />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}