import axios from 'axios';
import {API_URL,PORT} from '@env';
const API_Backend = `${API_URL}:${PORT}`;
const api = axios.create({
  baseURL: API_Backend,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthorizationHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};

export default api;
