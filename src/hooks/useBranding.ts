import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { brandingService } from "../services/branding.service";
import { defaultBranding, type Branding } from "../shared/interfaces/Branding";

const brandingQueryKey = ["store-branding"] as const;

export function useBranding() {
  const query = useQuery({
    queryKey: brandingQueryKey,
    queryFn: brandingService.get,
    staleTime: 5 * 60_000,
    meta: { errorMessage: "Não foi possível carregar a identidade da loja." },
  });
  return { ...query, branding: query.data ?? defaultBranding };
}

export function useSaveBranding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (branding: Branding) => brandingService.save(branding),
    onSuccess: () => {
      toast.success("Identidade da loja salva.");
      return queryClient.invalidateQueries({ queryKey: brandingQueryKey });
    },
    onError: () => toast.error("Não foi possível salvar a identidade da loja."),
  });
}
