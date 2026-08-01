// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

async function request(endpoint, { method = 'GET', body, params, auth = true } = {}) {
  let url = `${BASE_URL}${endpoint}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    if (query) url += `?${query}`;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json().catch(() => ({})) : {};

  if (!response.ok) {
    const message = data.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // ---- Auth ----
  register: ({ name, email, password }) =>
    request('/auth/register', { method: 'POST', body: { name, email, password }, auth: false }),

  login: ({ email, password }) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  getMe: () => request('/auth/me'),

  // ---- Users ----
  updateMe: (fields) => request('/users/me', { method: 'PUT', body: fields }),
  getUsers: () => request('/users'),
  getUserById: (id) => request(`/users/${id}`),
  updateUser: (id, fields) => request(`/users/${id}`, { method: 'PUT', body: fields }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // ---- Categories ----
  getCategories: () => request('/categories', { auth: false }),
  getCategoryById: (id) => request(`/categories/${id}`, { auth: false }),
  createCategory: (fields) => request('/categories', { method: 'POST', body: fields }),
  updateCategory: (id, fields) => request(`/categories/${id}`, { method: 'PUT', body: fields }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // ---- Events ----
  getEvents: (params) => request('/events', { params, auth: false }),
  getEventById: (id) => request(`/events/${id}`, { auth: false }),
  createEvent: (fields) => request('/events', { method: 'POST', body: fields }),
  updateEvent: (id, fields) => request(`/events/${id}`, { method: 'PUT', body: fields }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // ---- Ticket types ----
  getTicketTypesByEvent: (eventId) =>
    request(`/ticket-types/event/${eventId}`, { auth: false }),
  createTicketType: (fields) => request('/ticket-types', { method: 'POST', body: fields }),
  updateTicketType: (id, fields) => request(`/ticket-types/${id}`, { method: 'PUT', body: fields }),
  deleteTicketType: (id) => request(`/ticket-types/${id}`, { method: 'DELETE' }),

  // ---- Bookings ----
  createBooking: ({ ticket_type_id, quantity }) =>
    request('/bookings', { method: 'POST', body: { ticket_type_id, quantity } }),
  getMyBookings: () => request('/bookings/my'),
  getAllBookings: () => request('/bookings'),
  getBookingById: (id) => request(`/bookings/${id}`),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PUT' }),
  getBookingQRCode: (id) => request(`/bookings/${id}/qrcode`),
  verifyTicket: (token) => request('/bookings/verify', { method: 'POST', body: { token } }),

  // ---- Payments ----
  createPayment: ({ booking_id, payment_method, transaction_ref }) =>
    request('/payments', { method: 'POST', body: { booking_id, payment_method, transaction_ref } }),
  getPaymentByBooking: (bookingId) => request(`/payments/booking/${bookingId}`),

  // ---- Saved events ----
  getMySavedEvents: () => request('/saved-events/my'),
  saveEvent: (eventId) => request(`/saved-events/${eventId}`, { method: 'POST' }),
  unsaveEvent: (eventId) => request(`/saved-events/${eventId}`, { method: 'DELETE' }),

  // ---- Speakers ----
  getSpeakers: () => request('/speakers', { auth: false }),
  getSpeakersByEvent: (eventId) => request(`/speakers/event/${eventId}`, { auth: false }),
  createSpeaker: (fields) => request('/speakers', { method: 'POST', body: fields }),
  updateSpeaker: (id, fields) => request(`/speakers/${id}`, { method: 'PUT', body: fields }),
  deleteSpeaker: (id) => request(`/speakers/${id}`, { method: 'DELETE' }),
  linkSpeakerToEvent: ({ event_id, speaker_id }) =>
    request('/speakers/link', { method: 'POST', body: { event_id, speaker_id } }),
  unlinkSpeakerFromEvent: ({ event_id, speaker_id }) =>
    request('/speakers/unlink', { method: 'POST', body: { event_id, speaker_id } }),

  // ---- Uploads ----
  uploadImage: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData, // لا تضع Content-Type يدوياً، المتصفح يحددها تلقائياً مع boundary
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed');
    }
    return data; // { url: 'http://.../uploads/xxxx.jpg' }
  },
};

export default api;