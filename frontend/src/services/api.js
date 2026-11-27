const RAW_API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = RAW_API_URL ? `${RAW_API_URL}/api` : '/api';
const TOKEN_KEY = 'portfolio_admin_token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function resolveAssetUrl(pathOrUrl) {
  if (!pathOrUrl) return '/images/codegen-cover.png';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  if (pathOrUrl.startsWith('/uploads/')) {
    return RAW_API_URL ? `${RAW_API_URL}${pathOrUrl}` : pathOrUrl;
  }
  if (pathOrUrl.startsWith('/api/')) {
    return RAW_API_URL ? `${RAW_API_URL}${pathOrUrl}` : pathOrUrl;
  }
  return pathOrUrl;
}

async function request(endpoint, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const portfolioApi = {
  // Public endpoints
  getProfile: () => request('/profile'),
  getSkills: () => request('/skills'),
  getProjects: (category) =>
    request(category && category !== 'All' ? `/projects?category=${encodeURIComponent(category)}` : '/projects'),
  getProject: (slugOrId) => request(`/projects/${encodeURIComponent(slugOrId)}`),
  getTimeline: () => request('/timeline'),
  getLikes: () => request('/likes'),
  incrementLikes: () =>
    request('/likes', {
      method: 'POST',
    }),
  submitContact: (payload) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Auth endpoints
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request('/auth/me'),
  updatePassword: (payload) =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Protected Admin endpoints
  updateProfile: (payload) =>
    request('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  createSkill: (payload) =>
    request('/skills', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateSkill: (id, payload) =>
    request(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteSkill: (id) =>
    request(`/skills/${id}`, {
      method: 'DELETE',
    }),
  uploadProjectImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/projects/upload', {
      method: 'POST',
      body: formData,
    });
  },
  createProject: (payload) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProject: (id, payload) =>
    request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProject: (id) =>
    request(`/projects/${id}`, {
      method: 'DELETE',
    }),
  createTimelineItem: (payload) =>
    request('/timeline', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateTimelineItem: (id, payload) =>
    request(`/timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteTimelineItem: (id) =>
    request(`/timeline/${id}`, {
      method: 'DELETE',
    }),
  getContactMessages: () => request('/contact'),
  toggleMessageRead: (id, isRead) =>
    request(`/contact/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: isRead }),
    }),
  deleteContactMessage: (id) =>
    request(`/contact/${id}`, {
      method: 'DELETE',
    }),
};
