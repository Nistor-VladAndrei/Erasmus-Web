import axios from 'axios';
import { Article, ArticlesResponse, LoginResponse, SignupResponse } from '../Types/types';

const API_URL =  'http://localhost:3008/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', { username, password });
    return data;
  },
  signup: async (username: string, password: string): Promise<SignupResponse> => {
    const { data } = await api.post('/auth/signup', { username, password });
    return data;
  }
};

// Articles API
export const articlesAPI = {
  getAll: (page: number, limit: number) =>
    api.get(`/articles?page=${page}&limit=${limit}`).then(res => res.data),

  getAllForAdmin: () =>
    api.get('/articles/admin').then(res => res.data),

  getAllForUser: () =>
    api.get('/articles/mine').then(res => res.data),

  getOne: (id: string) =>
    api.get(`/articles/${id}`).then(res => res.data),

  create: (data: any) =>
    api.post('/articles', data).then(res => res.data),

  update: (id: string, data: any) =>
    api.put(`/articles/${id}`, data).then(res => res.data),

  delete: (id: string) =>
    api.delete(`/articles/${id}`).then(res => res.data),
};
    // Upload API
  export const uploadAPI = {
    uploadImage: async (file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
       });
        console.log(data);
        return data;
      },
  };
export default api;
