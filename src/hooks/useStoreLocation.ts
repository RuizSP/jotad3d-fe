import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  storeLocationsService,
  type SaveStoreLocationInput,
} from "../services/storeLocations.service";

export const storeLocationQueryKeys = {
  active: ["store-location", "active"] as const,
};

export function useActiveStoreLocation() {
  return useQuery({
    queryKey: storeLocationQueryKeys.active,
    queryFn: storeLocationsService.getActive,
    staleTime: 5 * 60_000,
    meta: { errorMessage: "Não foi possível carregar as configurações da loja." },
  });
}

export function useSaveStoreLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveStoreLocationInput) =>
      storeLocationsService.save(input),
    onSuccess: () => {
      toast.success("Configurações da loja salvas.");
      return queryClient.invalidateQueries({
        queryKey: storeLocationQueryKeys.active,
      });
    },
    onError: (error) => {
      console.error("Falha ao salvar configurações da loja.", error);
      toast.error("Não foi possível salvar as configurações da loja.");
    },
  });
}
