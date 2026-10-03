import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { catalogOptionsService } from "../services/catalogOptions.service";
import type { CatalogKind, CatalogOption } from "../shared/interfaces/CatalogOption";

export function useCatalogOptions(kind: CatalogKind) {
  return useQuery({
    queryKey: ["catalog-options", kind],
    queryFn: () => catalogOptionsService.list(kind),
    staleTime: 30_000,
  });
}

export function useSaveCatalogOption(kind: CatalogKind) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: Partial<CatalogOption> & { name: string }) => catalogOptionsService.save(kind, value),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["catalog-options", kind] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
      ]);
    },
  });
}
