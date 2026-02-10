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

  function handleLogin(userFromBackend) {
    setUser(userFromBackend);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

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