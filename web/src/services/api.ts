import axios from 'axios';
import { Article, ArticlesResponse, LoginResponse } from '../Types/types';

const API_URL =  'http://localhost:3001/api';

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
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
};

// Articles API
export const articlesAPI = {
  getAll: async (page = 1, limit = 10): Promise<ArticlesResponse> => {
    const { data } = await api.get(`/articles?page=${page}&limit=${limit}`);
    return data;
  },

  getAllForAdmin: async (): Promise<Article[]> => {
    const { data } = await api.get('/articles/admin');
    return data;
  },

  getOne: async (id: string): Promise<Article> => {
    const { data } = await api.get(`/articles/${id}`);
    return data;
  },

  create: async (article: Partial<Article>): Promise<Article> => {
    const { data } = await api.post('/articles', article);
    return data;
  },

  update: async (id: string, article: Partial<Article>): Promise<Article> => {
    const { data } = await api.put('/articles/${id}', article);
    return data;
} ,
    delete: async (id: string): Promise<void> => {
          await api.delete('/articles/${id}'
          );
    },
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

    return data;
    },
    };
export default api;
