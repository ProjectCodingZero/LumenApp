import { ResponseMedicalRecord } from '@/types/medicalRecordTypes';
import {
  RequestCreatePet,
  RequestUpdatePet,
  ResponsePet,
  ResponsePetMinimun,
} from '@/types/petTypes';
import { instance } from './apiClient';

/** Tamaño de página razonable para la lista de "Mis mascotas" */
const PETS_PAGE_SIZE = 10;

interface PaginatedParams {
  pageNumber?: number;
  pageSize?: number;
}

export const petService = {
  /** GET /api/pets/me -> mascotas del usuario autenticado */
  getPetsByOwner: async (params?: PaginatedParams): Promise<ResponsePetMinimun[]> => {
    const response = await instance.get<ResponsePetMinimun[]>('pets/me', {
      params: { pageNumber: 1, pageSize: PETS_PAGE_SIZE, ...params },
    });
    return response.data;
  },

  /** GET /api/pets/{id} (público) */
  getPetById: async (petId: string): Promise<ResponsePet> => {
    const response = await instance.get<ResponsePet>(`pets/${petId}`);
    return response.data;
  },

  /** POST /api/pets/me -> crea y vincula la mascota al perfil autenticado */
  createPetByOwner: async (data: RequestCreatePet): Promise<string> => {
    const response = await instance.post<{ id: string }>('pets/me', data);
    return response.data.id;
  },

  /** PUT /api/pets/{id} (parcial) -> 204 sin cuerpo */
  updatePetById: async (petId: string, data: RequestUpdatePet): Promise<void> => {
    await instance.put(`pets/${petId}`, data);
  },

  /** DELETE /api/pets/{id} -> 204 sin cuerpo */
  deletePetById: async (petId: string): Promise<void> => {
    await instance.delete(`pets/${petId}`);
  },

  /** GET /api/pets/{id}/medical-records (público) */
  getMedicalRecords: async (petId: string, params?: PaginatedParams): Promise<ResponseMedicalRecord[]> => {
    const response = await instance.get<ResponseMedicalRecord[]>(`pets/${petId}/medical-records`, {
      params: { page: 1, pageSize: PETS_PAGE_SIZE, ...params },
    });
    return response.data;
  },
};
