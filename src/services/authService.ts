import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from '@/types/authTypes';
import { instance } from './apiClient';
export const authService = {
    signIn: async (data: SignInRequest): Promise<SignInResponse> => {
        try{
            const response = await instance.post('/auth/signin', data);
            return response.data;
        }catch (error) {
            handleConnectionError(error, 'signin');
            throw error;
        }
    },  
    signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
        try{
            const response = await instance.post('/auth/signup', data);
            return response.data;
        }catch (error) {
            handleConnectionError(error, 'signup');
            throw error;
        }
    }
};

const handleConnectionError = (error: any, context: string) => {
  console.error(`--- DEBUG ERROR EN ${context.toUpperCase()} ---`);

  if (error.response) {
    const serverData = error.response.data;
    console.error("Status:", error.response.status);
    console.error("Data del servidor:", serverData);
    const detailedMessage = serverData?.detail ||
      serverData?.message ||
      serverData?.title ||
      (serverData?.errors ? JSON.stringify(serverData.errors) : null);

    if (detailedMessage) {
      throw new Error(detailedMessage);
    }
  } else if (error.request) {
    console.error(
      "No se recibió respuesta del servidor. Revisa CORS o si el puerto 5073 está abierto.",
    );
    throw new Error(
      "No se pudo conectar con el servidor. ¿Está encendido el Backend?",
    );
  } else {
    console.error("Error de configuración:", error.message);
  }

  throw error;
};