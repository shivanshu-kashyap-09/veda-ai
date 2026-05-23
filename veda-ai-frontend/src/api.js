import axios from 'axios';

const normalizeUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('/') || /^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
};

const DEFAULT_API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

const API_URL = normalizeUrl(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || DEFAULT_API_URL);

export const api = axios.create({
  baseURL: API_URL,
});

export const createAssignment = (data) => api.post('/assignments', data);
export const getAssignment = (id) => api.get(`/assignments/${id}`);
export const getAssignments = () => api.get('/assignments');
