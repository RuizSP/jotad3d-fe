import { supabase } from "./supabase";
import type { CatalogKind, CatalogOption } from "../shared/interfaces/CatalogOption";

const tables = {
  categories: "catalog_categories",
  colors: "catalog_colors",
  materials: "catalog_materials",
} as const;

const client = () => {
  if (!supabase) throw new Error("Supabase não está configurado.");
  return supabase;
};

const mapOption = (row: Record<string, unknown>): CatalogOption => ({
  id: String(row.id),
  name: String(row.name),
  active: Boolean(row.active),
  hex: typeof row.hex === "string" ? row.hex : undefined,
  additionalPrice: row.additional_price == null ? undefined : Number(row.additional_price),
});

export const catalogOptionsService = {
  async list(kind: CatalogKind): Promise<CatalogOption[]> {
    const { data, error } = await client().from(tables[kind]).select("*").order("name");
    if (error) throw error;
    return (data || []).map((row) => mapOption(row));
  },
  async save(kind: CatalogKind, value: Partial<CatalogOption> & { name: string }): Promise<void> {
    const name = value.name.trim();
    if (!name) throw new Error("Informe um nome.");
    const row: Record<string, unknown> = { name, active: value.active ?? true };
    if (kind === "colors") row.hex = value.hex;
    if (kind === "materials") row.additional_price = value.additionalPrice ?? 0;
    const table = client().from(tables[kind]);
    const { error } = value.id
      ? await table.update(row).eq("id", value.id)
      : await table.insert(row);
    if (error) throw error;
  },
};
