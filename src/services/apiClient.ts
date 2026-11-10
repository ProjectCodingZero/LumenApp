import { API_BASE_URL } from '@/constants/config';
import { AUTH_STORAGE_KEY, PROFILE_STORAGE_KEY } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, isAxiosError } from 'axios';

/**
 * Handler invocado cuando la API responde 401 fuera del flujo de login/registro.
 * AuthContext lo registra para cerrar la sesión automáticamente (token expirado).
 */
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

function isAuthEndpoint(url?: string): boolean {
  return Boolean(url && (url.includes('auth/signin') || url.includes('auth/signup')));
}

export const instance = create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      !isAuthEndpoint(error.config?.url)
    ) {
      // Token ausente o expirado: se limpia la sesión local y los guards redirigen.
      AsyncStorage.multiRemove([AUTH_STORAGE_KEY, PROFILE_STORAGE_KEY]).catch(() => {});
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);
