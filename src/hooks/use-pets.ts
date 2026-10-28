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