import { supabase } from './utils/supabase.js';

const BASE = `${import.meta.env.VITE_API_URL}/api/items`;

async function request(url, options = {}) {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error('Guest session unavailable');
  }

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.session.access_token}`,
      },
    });
  } catch {
    throw new Error('Cannot reach the server. Is Express running?');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || body.message || message;
    } catch {
      // response was not JSON, keep the default message
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

export const getSessions = () => request(BASE);

export const addSession = (session) =>
  request(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session),
  });

export const deleteSession = (id) =>
  request(`${BASE}/${id}`, { method: 'DELETE' });