const API_BASE = import.meta.env.VITE_API_URL;

async function api(path, method = 'GET', body, auth = true) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = 'Error API';
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {}
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* ───── auth ───── */

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Login incorrecto');
  }

  const data = await res.json();

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/* ───── fichajes ───── */

export async function getMyRecords() {
  const data = await api('/records/me');
  return Array.isArray(data) ? data : data.records || [];
}

export function recordIn() {
  return api('/records/in', 'POST');
}

export function recordOut() {
  return api('/records/out', 'POST');
}

/* ───── informes (MIS informes, pero usando el endpoint bueno) ───── */

export async function getMyReports({ userId, from, to }) {
  const params = new URLSearchParams();

  if (from) params.append('from', from);
  if (to) params.append('to', to);

  const res = await fetch(
    `${API_BASE}/reports/users/${userId}/daily?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error cargando informe diario');
  }

  return res.json();
}