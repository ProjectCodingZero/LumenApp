import { petService } from '@/services/petService';
import { RequestCreatePet } from '@/types/petTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** Claves de query centralizadas para invalidación consistente */
export const petKeys = {
  all: ['pets'] as const,
  mine: () => [...petKeys.all, 'mine'] as const,
  detail: (petId: string) => [...petKeys.all, 'detail', petId] as const,
  medicalRecords: (petId: string) => [...petKeys.detail(petId), 'medical-records'] as const,
};

export function useGetPets() {
  return useQuery({
    queryKey: petKeys.mine(),
    queryFn: () => petService.getPetsByOwner(),
    staleTime: 60 * 1000,
  });
}

export function usePetsId(petId: string) {
  return useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => petService.getPetById(petId),
    enabled: petId.length > 0,
  });
}

export function useMedicalRecords(petId: string) {
  return useQuery({
    queryKey: petKeys.medicalRecords(petId),
    queryFn: () => petService.getMedicalRecords(petId),
    enabled: petId.length > 0,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (petData: RequestCreatePet) => petService.createPetByOwner(petData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.mine() });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (petId: string) => petService.deletePetById(petId),
    onSuccess: (_data, petId) => {
      queryClient.removeQueries({ queryKey: petKeys.detail(petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.mine() });
    },
  });
}
