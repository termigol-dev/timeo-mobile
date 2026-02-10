import React, { useEffect, useState } from 'react';
import { clearToken, getMyRecords } from './api.js';

export default function HomeEmployee({ dark, setDark, onLogout }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRecords()
      .then(r => setRecords(r.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    clearToken();
    onLogout();
  }

  return (
    <div className="home">
      {/* HEADER */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">
            t<span className="i">i</span>meo
          </div>
        </div>

        <div className="topbar-right">
          <label className="toggle">
            <input
              type="checkbox"
              checked={dark}
              onChange={() => setDark(d => !d)}
            />
            <span>Modo oscuro</span>
          </label>

          <button className="logout" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="dashboard">
        <h4 className="section-title">Últimos registros</h4>

        {loading && (
          <div className="empty">Cargando…</div>
        )}

        {!loading && records.length === 0 && (
          <div className="empty">No hay registros todavía</div>
        )}

        <div className="activity-list">
          {records.map(r => (
            <div
              key={r.id}
              className={`activity-card ${r.type === 'IN' ? 'in' : 'out'}`}
            >
              <span className="badge">{r.type}</span>
              <span className="time">
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}