import { RequestCreatePet, ResponsePet } from '@/types/petTypes';
import { instance } from './apiClient';
export const petService = {
  getPetsByOwner: async (): Promise<ResponsePet[]> => {
    try{
      var pets = await instance.get<ResponsePet[]>('/pets/me').then((response) => {
        if (response.status !== 200) {
          throw new Error('Failed to fetch pets');
        }
        return response.data;
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
      console.error('Error creating pet:', error);
      throw error;
    }
  },
} as const;