import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const createAssignment = (data) => api.post('/assignments', data);
export const getAssignment = (id) => api.get(`/assignments/${id}`);
export const getAssignments = () => api.get('/assignments');
