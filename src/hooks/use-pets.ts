import { petService } from '@/services/petService';
import { RequestCreatePet } from '@/types/petTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type UsePetsOptions = {
  ownerId?: string;
  autoFetch?: boolean;
};
export function useGetPets(){
  return useQuery({
    queryKey: ['pets'],
    queryFn: petService.getPetsByOwner,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window regains focus
  });
}
export function useCreatePet(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (petData: RequestCreatePet) => petService.createPetByOwner(petData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
interface usePetsIdProps {
  petId: string;
  autoFetch?: boolean;
};
export function usePetsId({ petId, autoFetch = true }: usePetsIdProps) {

  return useQuery({
    queryKey: ['pets', petId],
    queryFn: () => petService.getPetById(petId),
    enabled: autoFetch,
    refetchOnWindowFocus: true, // Refetch when the window regains focus
  })
};