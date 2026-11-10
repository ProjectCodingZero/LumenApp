import { SignInRequest, SignInResponse, SignUpRequest } from '@/types/authTypes';
import { instance } from './apiClient';

export const authService = {
  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    const response = await instance.post<SignInResponse>('auth/signin', data);
    return response.data;
  },

  /** Registra un usuario. Responde 201 sin cuerpo; no inicia sesión automáticamente. */
  signUp: async (data: SignUpRequest): Promise<void> => {
    await instance.post('auth/signup', data);
  },
};
