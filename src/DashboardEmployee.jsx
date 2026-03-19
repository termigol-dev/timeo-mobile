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

  async function loadHistory() {
    setLoading(true);
    console.log(user)
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
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        backgroundColor: bg,
        color: text,
        fontFamily: font,
        overflow: 'hidden',
      }}
    >

      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >

        {/* IZQUIERDA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 14,
            fontWeight: 600,
          }}
        >

          {/* EMPRESA */}
          <span style={{ color: 'var(--text-soft)' }}>
            {user?.companyName || '—'}
          </span>

          {/* INFORMES */}
          <button
            onClick={() => navigate('/reports')}
            className="header-btn"
            title="Informes"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <span className="material-symbols-outlined">
              analytics
            </span>
          </button>

        </div>

        {/* CENTRO */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Logo dark={dark} size={60} />
        </div>

        {/* DERECHA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 16,
          }}
        >

          {/* DARK MODE */}
          <button
            className="header-btn"
            onClick={() => setDark(d => !d)}
            title="Modo oscuro"
          >
            <span className="material-symbols-outlined">
              {dark ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* SALIR */}
          <button
            className="header-btn logout"
            onClick={onLogout}
          >
            Salir
          </button>

        </div>

      </header>

      {/* MENSAJE */}
      <div className="employee-message-slot">
        {message && (
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 12,
              fontWeight: 700,
              backgroundColor:
                message.type === 'IN'
                  ? 'var(--green)'
                  : 'var(--red)',
              color: 'white',
              fontSize: 14
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div style={{ textAlign: 'center' }}>

        <div
          className={`employee-photo-wrapper ${isIn ? 'status-in' : 'status-out'}`}
          style={{ marginBottom: 16 }}
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

        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 20,
          }}
        >
          {user?.name} {user?.lastName}
        </div>

        <div className="employee-actions" style={{ margin: "20px 0" }}>
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
      </div>

      {/* HISTORIAL */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginTop: 10,
          paddingRight: 4
        }}
      >
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
                padding: 12,
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10
              }}
            >
              <div>
                <strong style={{ color: '#22c55e' }}>
                  Entrada
                </strong>
                <div style={{ fontSize: 13, color: muted }}>
                  {new Date(row.in.createdAt).toLocaleString()}
                </div>
              </div>

              {row.out && (
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#ef4444' }}>
                    Salida
                  </strong>
                  <div style={{ fontSize: 13, color: muted }}>
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