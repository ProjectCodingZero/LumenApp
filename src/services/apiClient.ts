import { API_BASE_URL } from '@/constants/config';
import { AUTH_STORAGE_KEY } from '@/constants/storage';
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
    const token = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    console.debug(`Token retrieved from AsyncStorage: ${token}`);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);