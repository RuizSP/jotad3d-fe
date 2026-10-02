import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ordersService } from "../services/orders.service";
import type { Order, OrderStatus } from "../shared/interfaces/Order";

export const orderQueryKeys = {
  all: ["orders"] as const,
  byCode: (code: string) => ["orders", "by-code", code] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: orderQueryKeys.all,
    queryFn: ordersService.getAll,
    staleTime: 30_000,
    meta: { errorMessage: "Não foi possível carregar os pedidos." },
  });
}

export function useOrderByAccessCode(code: string) {
  const normalizedCode = code.trim().toUpperCase();

  return useQuery({
    queryKey: orderQueryKeys.byCode(normalizedCode),
    queryFn: () => ordersService.getByAccessCode(normalizedCode),
    enabled: Boolean(normalizedCode),
    staleTime: 30_000,
    meta: { errorMessage: "Não foi possível buscar o pedido." },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
    onError: (error) => {
      console.error("Falha ao criar pedido.", error);
      toast.error("Não foi possível registrar o pedido.");
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      paid,
      notes,
    }: {
      id: string;
      status: OrderStatus;
      paid?: boolean;
      notes?: string;
    }) => ordersService.updateStatus(id, status, paid, notes),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
    onError: (error) => {
      console.error("Falha ao atualizar o pedido.", error);
      toast.error("Não foi possível atualizar o pedido.");
    },
  });
}

export type CreateOrderInput = Omit<
  Order,
  "id" | "accessCode" | "orderNumber" | "createdAt" | "status" | "paid"
>;
