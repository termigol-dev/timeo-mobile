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

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });

    return subscription;
  }

  /* -----------------------------
     LOGIN
  ----------------------------- */

  async function handleLogin(userFromBackend) {

    console.log("LOGIN OK");

    setUser(userFromBackend);

    const authToken = localStorage.getItem('token');

    try {

      const subscription = await subscribeToPush();

      if (!subscription) return;

      console.log("PUSH SUBSCRIPTION:", subscription);

      await fetch(`${import.meta.env.VITE_API_URL}/devices/register`, {
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

      console.log("DEVICE REGISTERED");

    } catch (err) {

      console.error("DEVICE REGISTER ERROR:", err);

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