export type CatalogKind = "categories" | "colors" | "materials";

export interface CatalogOption {
  id: string;
  name: string;
  active: boolean;
  hex?: string;
  additionalPrice?: number;
}
