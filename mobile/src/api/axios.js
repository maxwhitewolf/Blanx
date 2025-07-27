import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = await AsyncStorage.getItem('refresh');
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE_URL}auth/token/refresh/`, { refresh });
          const newToken = res.data.access;
          await AsyncStorage.setItem('token', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          await AsyncStorage.multiRemove(['token', 'refresh']);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
