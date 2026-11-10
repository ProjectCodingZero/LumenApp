import { specieService } from '@/services/specieService';
import { useQuery } from '@tanstack/react-query';

export const specieKeys = {
  all: ['species'] as const,
  races: (specieId: string) => [...specieKeys.all, specieId, 'races'] as const,
};

/** Catálogo público de especies (cambia muy poco: cache largo) */
export function useSpecies() {
  return useQuery({
    queryKey: specieKeys.all,
    queryFn: () => specieService.getSpecies(),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/** Razas de una especie, para el selector del alta de mascota */
export function useRacesBySpecie(specieId: string) {
  return useQuery({
    queryKey: specieKeys.races(specieId),
    queryFn: () => specieService.getRacesBySpecie(specieId),
    enabled: specieId.length > 0,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
