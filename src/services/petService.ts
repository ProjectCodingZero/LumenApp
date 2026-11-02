import { RequestCreatePet, ResponsePet, ResponsePetMinimun } from '@/types/petTypes';
import { instance } from './apiClient';
export const petService = {
  getPetsByOwner: async (): Promise<ResponsePetMinimun[]> => {
    try{
      var pets = await instance.get<ResponsePetMinimun[]>('/pets/me').then(async (response) => {
        if (response.status === 200 || response.status === 201) {
          return response.data;
        }
        throw new Error('Failed to fetch pets');
      });
        return pets;
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },
  createPetByOwner: async (data: RequestCreatePet): Promise<string> => {
    try {
      const response = await instance.post('/pets/me', data);
      return response.data;
    } catch (error) {
      handleConnectionError(error, 'createPet');
      throw error;
    }
  },
  getPetById: async (petId: string): Promise<ResponsePet> => {
    try {
      const response = await instance.get<ResponsePet>(`/pets/${petId}`);
      console.log(`Fetched pet with ID ${petId}:`, response.data);
      return response.data;
    } catch (error) {
      handleConnectionError(error, 'getPetById');
      throw error;
    }
  },
  updatePetById: async (petId: string, data: RequestCreatePet): Promise<ResponsePetMinimun> => {
    try {
      const response = await instance.put<ResponsePetMinimun>(`/pets/${petId}`, data);
      return response.data;
    } catch (error) {
      handleConnectionError(error, 'updatePetById');
      throw error; // Re-throw the error after handling it
    }
  },
} as const;

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