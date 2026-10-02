import { useState, type ReactNode } from "react";
import { createContext, useContext } from "react";

interface FilterProviderProps<T> {
  children: ReactNode;
  initialFormValues?: T;
}

export interface OpenFilterInterface<T> {
  data?: T;
}

export interface FilterType<T> {
  filterValues: T | null;
  appliedValues: T | null;
}

export const FilterContext = createContext<FilterType<any> | undefined>(
  undefined,
);

export function useFilter<T>() {
  const context = useContext(FilterContext) as FilterType<T> | undefined;
  if (!context)
    throw new Error(
      "useFilterContext must be used within a FilterContextProvider",
    );
  return context;
}

export interface FilterApiType<T> {
  changeFilterValues: (data: T) => void;
  changeFilterValue: (field: string, value: any) => void;
  applyFilterValues: (data: T) => void;
  applyFilterValue: (field: string, value: any) => void;
}

export const FilterContextApi = createContext<FilterApiType<any> | undefined>(
  undefined,
);

export function useFilterApi<T>() {
  const context = useContext(FilterContextApi) as FilterApiType<T> | undefined;
  if (!context)
    throw new Error(
      "useFilterContextApi must be used within a FilterContextApiProvider",
    );
  return context;
}

export default function FilterProvider<T>({
  children,
  initialFormValues = {} as T,
}: FilterProviderProps<T>) {
  const [filterValues, setFilterValues] = useState<T>(initialFormValues);
  const [appliedValues, setAplliedValues] = useState<T>(initialFormValues);

  const changeFilterValues = (data: T) => {
    setFilterValues((prev) => ({ ...prev, ...data }));
  };

  const changeFilterValue = (field: string, value: any) => {
    setFilterValues((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const applyFilterValues = (data: T) => {
    setAplliedValues((prev) => ({ ...prev, ...data }));
  };
  const applyFilterValue = (field: string, value: any) => {
    setAplliedValues((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  return (
    <FilterContextApi.Provider
      value={{
        changeFilterValue,
        changeFilterValues,
        applyFilterValues,
        applyFilterValue,
      }}
    >
      <FilterContext.Provider
        value={{
          appliedValues,
          filterValues,
        }}
      >
        {children}
      </FilterContext.Provider>
    </FilterContextApi.Provider>
  );
}
