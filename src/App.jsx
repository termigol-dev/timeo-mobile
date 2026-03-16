import React, { useState, useLayoutEffect, useEffect } from 'react';
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

  function handleLogin(userFromBackend) {
    setUser(userFromBackend);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  // REGISTRAR DISPOSITIVO CUANDO EL USUARIO ESTÁ LOGUEADO
  useEffect(() => {

    if (!user) return;

    let deviceToken = localStorage.getItem('deviceToken');

    if (!deviceToken) {
      deviceToken = crypto.randomUUID();
      localStorage.setItem('deviceToken', deviceToken);
    }

    const authToken = localStorage.getItem('token');
    if (!authToken) return;

    fetch(`${import.meta.env.VITE_API_URL}/devices/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        token: deviceToken,
        platform: 'WEB'
      })
    }).catch(err => {
      console.error('Error registering device:', err);
    });

  }, [user]);

  // LOGIN
  if (!user) {
    return (
      <Login
        dark={dark}
        setDark={setDark}
        onLogin={handleLogin}
      />
    );
  }

  // APP MÓVIL (sin roles)
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