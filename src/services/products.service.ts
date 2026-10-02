import { supabase } from "./supabase";
import type { Product } from "../shared/interfaces/Product";

const DEFAULT_PRODUCT_COLORS = ["Preto", "Branco", "Dourado"];

export const MOCK_PRODUCTS: Product[] = [];

interface SupabaseProductRow {
  id: string;
  nome: string;
  preco: number | string;
  preco_pintura: number | string | null;
  imagem_url: string | null;
  categoria: string | null;
  descricao: string | null;
  cores: string[] | null;
  dimensoes: string | null;
  material: string | null;
}

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase não está configurado para persistir produtos.");
  }
  return supabase;
};

const mapProduct = (item: SupabaseProductRow): Product => ({
  id: String(item.id),
  name: item.nome,
  price: Number(item.preco),
  paintingPrice:
    item.preco_pintura != null ? Number(item.preco_pintura) : undefined,
  imageUrl: item.imagem_url || "",
  category: item.categoria || "Geral",
  description: item.descricao || "",
  availableColors: Array.isArray(item.cores)
    ? item.cores
    : DEFAULT_PRODUCT_COLORS,
  dimensions: item.dimensoes || undefined,
  material: item.material || "PLA Premium",
  inStock: true,
});

export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await requireSupabase()
      .from("produtos")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) throw error;
    return (data || []).map((item) => mapProduct(item));
  },

  async getById(id: string): Promise<Product | undefined> {
    const { data, error } = await requireSupabase()
      .from("produtos")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapProduct(data) : undefined;
  },

  async create(input: Omit<Product, "id">): Promise<Product> {
    const { data, error } = await requireSupabase()
      .from("produtos")
      .insert({
        nome: input.name,
        preco: input.price,
        preco_pintura: input.paintingPrice ?? null,
        imagem_url: input.imageUrl,
        descricao: input.description,
        categoria: input.category,
        material: input.material,
        dimensoes: input.dimensions,
        cores: input.availableColors,
      })
      .select("*")
      .single();

    if (error) throw error;
    if (!data) throw new Error("O Supabase não retornou o produto criado.");
    return mapProduct(data);
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const patch: Record<string, unknown> = {};
    if (updates.name !== undefined) patch.nome = updates.name;
    if (updates.price !== undefined) patch.preco = updates.price;
    if (updates.paintingPrice !== undefined)
      patch.preco_pintura = updates.paintingPrice;
    if (updates.imageUrl !== undefined) patch.imagem_url = updates.imageUrl;
    if (updates.description !== undefined)
      patch.descricao = updates.description;
    if (updates.category !== undefined) patch.categoria = updates.category;
    if (updates.material !== undefined) patch.material = updates.material;
    if (updates.dimensions !== undefined) patch.dimensoes = updates.dimensions;
    if (updates.availableColors !== undefined)
      patch.cores = updates.availableColors;

    const { data, error } = await requireSupabase()
      .from("produtos")
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? mapProduct(data) : null;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await requireSupabase()
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};
