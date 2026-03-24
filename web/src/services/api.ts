import axios from 'axios';
import { LoginResponse, SignupResponse, Project } from '../Types/types';

const API_URL = 'http://localhost:3008/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', { username, password });
    return data;
  },
  signup: async (username: string, password: string): Promise<SignupResponse> => {
    const { data } = await api.post('/auth/signup', { username, password });
    return data;
  },
};

export const articlesAPI = {
  getAll: (page: number, limit: number) =>
    api.get(`/articles?page=${page}&limit=${limit}`).then((res) => res.data),

  getAllForAdmin: () => api.get('/articles/admin').then((res) => res.data),

  getAllForUser: () => api.get('/articles/mine').then((res) => res.data),

  getOne: (id: string) => api.get(`/articles/${id}`).then((res) => res.data),

  create: (data: Record<string, unknown>) => api.post('/articles', data).then((res) => res.data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/articles/${id}`, data).then((res) => res.data),

  delete: (id: string) => api.delete(`/articles/${id}`).then((res) => res.data),
};

export const projectsAPI = {
  getAll: (): Promise<Project[]> => api.get('/projects').then((res) => res.data),

  create: (body: { name: string }): Promise<Project> =>
    api.post('/projects', body).then((res) => res.data),
};

export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export default api;
