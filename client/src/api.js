const BASE = '/api/sessions';

async function request(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error('Cannot reach the server. Is Express running?');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.error || data.message || message;
    } catch {
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

export const deleteSession = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });