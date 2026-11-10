const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const API_URL = `${configuredApiUrl.replace(/\/+$/, '')}${configuredApiUrl.replace(/\/+$/, '').endsWith('/api') ? '' : '/api'}`;
export async function api(path, options = {}, token) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || 'The request could not be completed.');
  return data;
}
