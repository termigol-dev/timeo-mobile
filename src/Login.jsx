import React, { useState } from 'react';
import { login } from './api.js';

export default function Login({ onLogin, dark, setDark }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      // 🔑 pasamos el user REAL al App
      onLogin(data.user);
    } catch {
      setError('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="centered">
      <form className="card form" onSubmit={submit}>
        <div className="logo">
          t<span className="i">i</span>meo
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <label className="toggle">
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(d => !d)}
          />
          <span>Modo oscuro</span>
        </label>
      </form>
    </div>
  );
}