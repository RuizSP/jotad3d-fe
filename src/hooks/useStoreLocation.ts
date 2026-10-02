import { useQuery } from "@tanstack/react-query";
import { storeLocationsService } from "../services/storeLocations.service";

export const storeLocationQueryKeys = {
  active: ["store-location", "active"] as const,
};

export function useActiveStoreLocation() {
  return useQuery({
    queryKey: storeLocationQueryKeys.active,
    queryFn: storeLocationsService.getActive,
    staleTime: 5 * 60_000,
    meta: { errorMessage: "Não foi possível carregar o endereço da loja." },
  });
}
