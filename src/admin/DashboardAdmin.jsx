import React, { useState } from 'react';
import {
  Users,
  Building2,
  FileBarChart,
  User,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  { label: 'Empresas', icon: Building2, path: '/admin/companies' },
  { label: 'Empleados', icon: Users, path: '/admin/employees' },
  { label: 'Informes', icon: FileBarChart, path: '/admin/reports' },
];

export default function DashboardAdmin({ dark, setDark, onLogout }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const current = slides[index];
  const Icon = current.icon;

  const prev = () =>
    setIndex(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () =>
    setIndex(i => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="dashboard-admin">
      {/* HEADER */}
       {/* HEADER */}
  <header className="admin-header">
    {/* IZQUIERDA · MODO OSCURO */}
    <div className="header-left">
      <button
        className="dark-toggle-btn"
        onClick={() => setDark(d => !d)}
      >
        <span className="toggle-icon">
          {dark ? '🌙' : '☀️'}
        </span>
        <span className="toggle-text">Modo oscuro</span>
      </button>
    </div>

    {/* CENTRO · LOGO */}
    <div className="logo logo-large">
      t<span className="i">i</span>meo
    </div>

    {/* DERECHA · ACCIONES */}
    <div className="header-actions">
      <button
        className="header-btn"
        onClick={() => navigate('/admin/profile')}
      >
        <User size={18} />
        <span>Mi perfil</span>
      </button>

      <button
        className="header-btn logout"
        onClick={onLogout}
      >
        <LogOut size={18} />
        <span>Salir</span>
      </button>
    </div>
  </header>

      {/* SLIDER */}
      <div className="slider-wrapper">
        <button className="arrow left" onClick={prev}>
          ‹
        </button>

        <div
          className="slide-card"
          onClick={() => navigate(current.path)}
        >
          <Icon size={64} />
          <span>{current.label}</span>
        </div>

        <button className="arrow right" onClick={next}>
          ›
        </button>
      </div>

      {/* DOTS */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}