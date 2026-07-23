const BASE_URL = 'http://localhost:5000/api';

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Error: ${response.status}`);
  }

  return data;
};

export const api = {
  login: (credentials) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => fetchWithAuth('/auth/me'),

  getEvents: () => fetchWithAuth('/events').catch(() => []),

  getSavedEvents: () => fetchWithAuth('/saved-events').catch(() => []),
};