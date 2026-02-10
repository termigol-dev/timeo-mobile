import React, { useEffect, useState } from 'react';
import {
  recordIn,
  recordOut,
  getMyStatus,
  confirmIncident,
} from '../api/mobileApi';
import EmployeeSchedule from './EmployeeSchedule';

export default function EmployeeHome({ dark, setDark }) {
  const [user, setUser] = useState(null);
  const [working, setWorking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incidence, setIncidence] = useState(null);
  const [view, setView] = useState('home'); // home | schedule

  /* ===============================
     CARGA ESTADO INICIAL
  =============================== */
  useEffect(() => {
    async function load() {
      try {
        const data = await getMyStatus();
        setWorking(data.status === 'IN');
        if (data.user) setUser(data.user);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ===============================
     ACCIONES
  =============================== */
  async function handleIn() {
    const res = await recordIn();
    if (res?.requiresConfirmation) {
      setIncidence({
        message: res.message,
        question: res.question,
      });
      return;
    }
    setWorking(true);
  }

  async function handleOut() {
    await recordOut();
    setWorking(false);
  }

  async function answerIncidence(admitted) {
    await confirmIncident({ admitted });
    setIncidence(null);
    setWorking(admitted);
  }

  if (loading) return <div className="center">Cargando…</div>;
  if (!user) return <div className="center">Error cargando usuario</div>;

  /* ===============================
     TOP BAR (COMÚN)
  =============================== */
  const TopBar = (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <button
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: 14,
          cursor: 'pointer',
          color: dark ? '#e5e7eb' : '#111827',
        }}
        onClick={() =>
          setView(view === 'home' ? 'schedule' : 'home')
        }
      >
        {view === 'home' ? 'Horarios' : '← Volver'}
      </button>

      <button
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: 18,
          cursor: 'pointer',
          color: dark ? '#e5e7eb' : '#111827',
        }}
        onClick={() => setDark(d => !d)}
      >
        {dark ? '☀️' : '🌙'}
      </button>
    </div>
  );

  /* ===============================
     VISTA HORARIOS
  =============================== */
  if (view === 'schedule') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: dark ? '#0f172a' : '#ffffff',
          color: dark ? '#e5e7eb' : '#111827',
          padding: 24,
        }}
      >
        {TopBar}
        <EmployeeSchedule />
      </div>
    );
  }

  /* ===============================
     VISTA PRINCIPAL
  =============================== */
  return (
    <div
      style={{
        minHeight: '100vh',
        background: dark ? '#0f172a' : '#ffffff',
        color: dark ? '#e5e7eb' : '#111827',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
      }}
    >
      {TopBar}

      {/* ───────── PERFIL ───────── */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: '#1e293b',
            margin: '0 auto 16px',
          }}
        />
        <div style={{ fontSize: 22, fontWeight: 600 }}>
          {user.name} {user.firstSurname}
        </div>
      </div>

      {/* ───────── INCIDENCIA ───────── */}
      {incidence && (
        <div
          style={{
            marginTop: 24,
            padding: 14,
            borderRadius: 12,
            background: '#1e293b',
            fontSize: 14,
            textAlign: 'center',
            maxWidth: 320,
          }}
        >
          <p>{incidence.message}</p>
          <p>{incidence.question}</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => answerIncidence(true)}>Sí</button>
            <button onClick={() => answerIncidence(false)}>No</button>
          </div>
        </div>
      )}

      {/* ───────── BOTONES ───────── */}
      <div
        style={{
          marginTop: 48,
          width: '100%',
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <button
          onClick={handleIn}
          disabled={working}
          style={{
            height: 72,
            fontSize: 22,
            fontWeight: 600,
            borderRadius: 16,
            border: 'none',
            background: '#16a34a',
            color: '#fff',
            opacity: working ? 0.4 : 1,
            cursor: working ? 'default' : 'pointer',
          }}
        >
          IN
        </button>

        <button
          onClick={handleOut}
          disabled={!working}
          style={{
            height: 72,
            fontSize: 22,
            fontWeight: 600,
            borderRadius: 16,
            border: 'none',
            background: '#dc2626',
            color: '#fff',
            opacity: !working ? 0.4 : 1,
            cursor: !working ? 'default' : 'pointer',
          }}
        >
          OUT
        </button>
      </div>
    </div>
  );
}