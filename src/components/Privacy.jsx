import React, { useState } from 'react';

export default function Privacy({ data, onAccepted }) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function acceptPrivacy() {
    setLoading(true);
    setError('');

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/accept-privacy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: data.userId
          })
        }
      );

      if (!res.ok) {
        throw new Error('Error aceptando privacidad');
      }

      const result = await res.json();

      // 🔥 devuelve token + user al Login/App
      onAccepted(result);

    } catch (err) {
      console.error(err);
      setError('Error al aceptar la política');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="centered">
      <div className="card form">

        <h2 style={{ marginBottom: 12 }}>
          Política de privacidad
        </h2>

        <p style={{
          fontSize: 14,
          marginBottom: 20,
          lineHeight: 1.5,
          color: '#64748b'
        }}>
          Para poder utilizar Timeo debes aceptar la política de protección de datos.
        </p>

        <button
          className="login-button"
          onClick={acceptPrivacy}
          disabled={loading}
        >
          {loading ? 'Guardando…' : 'Aceptar y continuar'}
        </button>

        {error && (
          <div className="error" style={{ marginTop: 12 }}>
            {error}
          </div>
        )}

      </div>
    </div>
  );
}