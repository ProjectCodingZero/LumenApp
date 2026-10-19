import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

instance.interceptors.request.use(
  async (config) => {
    // Aquí podrías recuperar el token de AsyncStorage o un estado global
    const token = await AsyncStorage.getItem('user_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);