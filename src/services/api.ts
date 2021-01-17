import axios, { AxiosRequestConfig } from 'axios';

import { authenticationService } from '@/services/AuthenticationService';
import router from '@/router';
import store from '@/store';

const baseURL = 'https://cs-demo-api.herokuapp.com';

export const client = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = await authenticationService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      store.dispatch('clear').then(() => router.replace('/login'));
    }
    return Promise.reject(error);
  },
);
