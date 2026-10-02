import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";

interface UseReactQueryProps {
  api: AxiosInstance;
  queryKeys: string[];
}

export interface ArrayResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
  };
}

export interface ObjectResponse<T> {
  data: T;
}

export function useReactQuery({ api, queryKeys }: UseReactQueryProps) {
  const queryClient = useQueryClient();
  const mainKey = queryKeys[0]; // Assuming the first key is the main resource key

  function usePesquisar<T>(
    url: string,
    params?: object,
    config?: {
      method?: "get" | "post";
      data?: any;
      queryOptions?: Partial<UseQueryOptions<T, Error>>;
    },
  ) {
    const { method = "get", data, queryOptions } = config || {};

    return useQuery<T, Error>({
      queryKey: [...queryKeys, "list", params, config],
      queryFn: async () => {
        let response: AxiosResponse<T>;
        if (method === "post") {
          response = await api.post<T>(url, data, { params });
        } else {
          response = await api.get<T>(url, { params });
        }
        return response.data;
      },
      ...queryOptions,
    });
  }

  function usePesquisarPorId<T>(
    url: string,
    id: string | number | undefined,
    queryOptions?: Partial<UseQueryOptions<T, Error>>,
  ) {
    return useQuery<T, Error>({
      queryKey: [...queryKeys, "detail", id],
      queryFn: async () => {
        const response = await api.get<T>(`${url}/${id}`);
        return response.data;
      },
      enabled: !!id,
      ...queryOptions,
    });
  }

  function useAdicionar<T, TVariables = any, TContext = unknown>(
    url: string,
    mutationOptions?: UseMutationOptions<T, Error, TVariables, TContext>,
  ) {
    const { onSuccess, onError, ...rest } = mutationOptions || {};
    return useMutation<T, Error, TVariables, TContext>({
      mutationFn: async (newData) => {
        const response = await api.post<T>(url, newData);
        return response.data;
      },
      onSuccess: (...args) => {
        const [data, variables, context] = args;
        queryClient.invalidateQueries({ queryKey: [mainKey] });
        toast.success("Registro adicionado com sucesso!");
        (onSuccess as any)?.(data, variables, context);
      },
      onError: (...args) => {
        const [error, variables, context] = args;
        toast.error("Erro ao adicionar registro.");
        console.error(error);
        (onError as any)?.(error, variables, context);
      },
      ...rest,
    });
  }

  function useAlterar<T, TVariables = any, TContext = unknown>(
    url: string,
    mutationOptions?: UseMutationOptions<T, Error, TVariables, TContext>,
  ) {
    const { onSuccess, onError, ...rest } = mutationOptions || {};
    return useMutation<T, Error, TVariables, TContext>({
      mutationFn: async (newData) => {
        const response = await api.put<T>(url, newData);
        return response.data;
      },
      onSuccess: (...args) => {
        const [data, variables, context] = args;
        queryClient.invalidateQueries({ queryKey: [mainKey] });
        toast.success("Registro alterado com sucesso!");
        (onSuccess as any)?.(data, variables, context);
      },
      onError: (...args) => {
        const [error, variables, context] = args;
        toast.error("Erro ao alterar registro.");
        console.error(error);
        (onError as any)?.(error, variables, context);
      },
      ...rest,
    });
  }

  function useRemover<T = void, TVariables = string | number, TContext = unknown>(
    url: string,
    mutationOptions?: UseMutationOptions<T, Error, TVariables, TContext>,
  ) {
    const { onSuccess, onError, ...rest } = mutationOptions || {};
    return useMutation<T, Error, TVariables, TContext>({
      mutationFn: async (id) => {
        const response = await api.delete<T>(`${url}/${id}`);
        return response.data;
      },
      onSuccess: (...args) => {
        const [data, variables, context] = args;
        queryClient.invalidateQueries({ queryKey: [mainKey] });
        toast.success("Registro removido com sucesso!");
        (onSuccess as any)?.(data, variables, context);
      },
      onError: (...args) => {
        const [error, variables, context] = args;
        toast.error("Erro ao remover registro.");
        console.error(error);
        (onError as any)?.(error, variables, context);
      },
      ...rest,
    });
  }

  return {
    usePesquisar,
    usePesquisarPorId,
    useAdicionar,
    useAlterar,
    useRemover,
  };
}
