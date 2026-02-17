import React, { useEffect, useState } from 'react';
import { getMyRecords, recordIn, recordOut } from './api';
import { useNavigate } from 'react-router-dom';
import Logo from "./components/Logo";

const font = `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;

export default function DashboardEmployee({
  user,
  dark,
  setDark,
  onLogout,
}) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  console.log('👤 user in DashboardEmployee', user);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await getMyRecords();
      setHistory(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (err) {
      console.error('❌ Error cargando registros:', err);
      setHistory([]);
      setMessage('Error cargando registros');
    } finally {
      setLoading(false);
    }
  }

  const last = history[0];
  const isIn = last?.type === 'IN';

  const bg = dark ? '#020617' : '#f5f7fa';
  const card = dark ? '#0f172a' : '#ffffff';
  const text = dark ? '#ffffff' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';

  async function handleIn() {
    const now = new Date().toISOString();
    await recordIn();

    setHistory(prev => [{ type: 'IN', createdAt: now }, ...prev]);
    setMessage({ text: 'Entrada registrada', type: 'IN' });

    setTimeout(() => setMessage(null), 5000);
  }

  async function handleOut() {
    const now = new Date().toISOString();
    await recordOut();

    setHistory(prev => [{ type: 'OUT', createdAt: now }, ...prev]);
    setMessage({ text: 'Salida registrada', type: 'OUT' });

    setTimeout(() => setMessage(null), 5000);
  }

  function getInitials(name) {
    if (!name) return '👤';
    const parts = name.trim().split(' ');
    return (
      (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
    ).toUpperCase();
  }

  function groupRecords(records) {
    const rows = [];
    let current = null;

    records
      .slice()
      .reverse()
      .forEach(r => {
        if (r.type === 'IN') {
          current = { in: r, out: null };
          rows.push(current);
        } else if (r.type === 'OUT' && current && !current.out) {
          current.out = r;
          current = null;
        }
      });

    return rows.reverse();
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 20,
        backgroundColor: bg,
        color: text,
        fontFamily: font,
      }}
    >
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <button
            className="dark-toggle-btn"
            onClick={() => setDark(d => !d)}
          >
            <span className="toggle-icon">
              {dark ? '🌙' : '☀️'}
            </span>
            <span>Modo oscuro</span>
          </button>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 32
        }}>
          <Logo dark={dark} size={80} />
        </div>
        <div className="header-actions">
          <button
            className="header-btn"
            onClick={() => navigate('/reports')}
          >
            Informes
          </button>

          <button
            className="header-btn"
            onClick={() => alert('Perfil (pendiente)')}
          >
            Mi perfil
          </button>

          <button
            className="header-btn logout"
            onClick={onLogout}
          >
            Salir
          </button>
        </div>
      </header>

      {/* MENSAJE TEMPORAL (espacio fijo) */}
      <div
        style={{
          height: 44,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        {message && (
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              fontWeight: 700,
              backgroundColor:
                message.type === 'IN'
                  ? 'var(--green)'
                  : 'var(--red)',
              color: 'white',
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* FOTO + NOMBRE */}
      <div
        className={`employee-photo-wrapper ${isIn ? 'status-in' : 'status-out'
          }`}
        style={{ marginBottom: 28 }}
      >
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt="Foto empleado"
            className="employee-photo"
          />
        ) : (
          <div className="employee-photo placeholder">
            <span className="avatar-icon">👤</span>
            <span className="avatar-initials">
              {getInitials(user?.name)}
            </span>
          </div>
        )}
      </div>

      {/* NOMBRE COMPLETO */}
      <div
        style={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 32,
        }}
      >
        {user?.name}
      </div>

      {/* BOTONES IN / OUT */}
      <div className="employee-actions">
        <button
          onClick={handleIn}
          disabled={isIn}
          className="employee-btn in"
        >
          IN
        </button>

        <button
          onClick={handleOut}
          disabled={!isIn}
          className="employee-btn out"
        >
          OUT
        </button>
      </div>

      {/* HISTORIAL */}
      <div style={{ display: 'grid', gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: muted }}>
            Cargando…
          </div>
        ) : (
          groupRecords(history).map((row, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: card,
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong style={{ color: '#22c55e' }}>
                  Entrada
                </strong>
                <div style={{ fontSize: 14, color: muted }}>
                  {new Date(row.in.createdAt).toLocaleString()}
                </div>
              </div>

              {row.out && (
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#ef4444' }}>
                    Salida
                  </strong>
                  <div style={{ fontSize: 14, color: muted }}>
                    {new Date(row.out.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}