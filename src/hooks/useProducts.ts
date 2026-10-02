import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { productsService } from "../services/products.service";
import type { Product } from "../shared/interfaces/Product";

export const productQueryKeys = {
  all: ["products"] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productQueryKeys.all,
    queryFn: productsService.getAll,
    staleTime: 30_000,
    meta: { errorMessage: "Não foi possível carregar os produtos." },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productQueryKeys.detail(id ?? ""),
    queryFn: () => {
      if (!id) throw new Error("O identificador do produto é obrigatório.");
      return productsService.getById(id);
    },
    enabled: Boolean(id),
    staleTime: 30_000,
    meta: { errorMessage: "Não foi possível carregar o produto." },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
    onError: (error) => {
      console.error("Falha ao criar produto.", error);
      toast.error("Não foi possível cadastrar o produto.");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productsService.update(id, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
    onError: (error) => {
      console.error("Falha ao atualizar produto.", error);
      toast.error("Não foi possível atualizar o produto.");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
    onError: (error) => {
      console.error("Falha ao excluir produto.", error);
      toast.error("Não foi possível excluir o produto.");
    },
  });
}
