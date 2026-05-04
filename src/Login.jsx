import React, { useState } from 'react';
import { login } from './api.js';
import Logo from "./components/Logo";

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


console.log("RESPUESTA LOGIN:", data); 

      // 🔑 guardar token
      localStorage.setItem("token", data.token);

      // guardar usuario
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin({
  user: data.user,
  token: data.token
});

    } catch {

      setError('Credenciales incorrectas');

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="centered">
      <form className="card form" onSubmit={submit}>

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 32
        }}>
          <Logo dark={dark} size={150} />
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