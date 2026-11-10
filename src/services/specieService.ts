import { LumenResult, ResponseSpecie, ResponseSpecieRace } from '@/types/specieTypes';
import { instance } from './apiClient';

const SPECIES_PAGE_SIZE = 50;

export const specieService = {
  /** GET /api/species (público) -> [{ id, name }] */
  getSpecies: async (): Promise<ResponseSpecie[]> => {
    const response = await instance.get<ResponseSpecie[]>('species', {
      params: { pageNumber: 1, pageSize: SPECIES_PAGE_SIZE },
    });
    return response.data;
  },

  /**
   * GET /api/species/{id}/races (público).
   * El endpoint devuelve un envoltorio FluentResults; se desenvuelve `.value.races`.
   */
  getRacesBySpecie: async (specieId: string): Promise<ResponseSpecieRace> => {
    const response = await instance.get<LumenResult<ResponseSpecieRace>>(
      `species/${specieId}/races`,
      { params: { pageNumber: 1, pageSize: SPECIES_PAGE_SIZE } }
    );
    return response.data.value ?? response.data.valueOrDefault;
  },
};
