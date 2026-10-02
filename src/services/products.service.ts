import { supabase, isSupabaseConfigured } from "./supabase";
import type { Product } from "../shared/interfaces/Product";

const LOCAL_PRODUCTS_KEY = "@jotad3d:custom_products";

export const MOCK_PRODUCTS: Product[] = [];

const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch {}
};

export const productsService = {
  async getAll(): Promise<Product[]> {
    const customList = getStoredProducts();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .order("criado_em", { ascending: false });

        if (!error && data && data.length > 0) {
          const remoteMapped: Product[] = data.map((item) => ({
            id: String(item.id),
            name: item.nome,
            price: Number(item.preco),
            paintingPrice: item.preco_pintura != null ? Number(item.preco_pintura) : undefined,
            imageUrl: item.imagem_url || "",
            category: item.categoria || "Geral",
            description: item.descricao || "",
            availableColors: Array.isArray(item.cores) ? item.cores : ["Preto", "Branco", "Dourado"],
            dimensions: item.dimensoes || undefined,
            material: item.material || "PLA Premium",
            inStock: true,
          }));

          return [...customList, ...remoteMapped];
        }
      } catch {}
    }

    return customList;
  },

  async getById(id: string): Promise<Product | undefined> {
    const all = await this.getAll();
    return all.find((p) => p.id === id);
  },

  async create(input: Omit<Product, "id">): Promise<Product> {
    const id = `3d-custom-${Date.now()}`;
    const newProduct: Product = {
      ...input,
      id,
    };

    const current = getStoredProducts();
    saveStoredProducts([newProduct, ...current]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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
          .select("id")
          .single();

        if (!error && data) {
          newProduct.id = String(data.id);
        }
      } catch {}
    }

    return newProduct;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const current = getStoredProducts();
    const existingIndex = current.findIndex((p) => p.id === id);

    let updatedProduct: Product;
    if (existingIndex >= 0) {
      updatedProduct = { ...current[existingIndex], ...updates };
      current[existingIndex] = updatedProduct;
      saveStoredProducts(current);
    } else {
      return null;
    }

    if (isSupabaseConfigured && supabase && !id.startsWith("3d-custom")) {
      try {
        const patch: Record<string, any> = {};
        if (updates.name) patch.nome = updates.name;
        if (updates.price !== undefined) patch.preco = updates.price;
        if (updates.paintingPrice !== undefined) patch.preco_pintura = updates.paintingPrice;
        if (updates.imageUrl) patch.imagem_url = updates.imageUrl;
        if (updates.description) patch.descricao = updates.description;
        if (updates.category) patch.categoria = updates.category;
        if (updates.material) patch.material = updates.material;
        if (updates.dimensions) patch.dimensoes = updates.dimensions;
        if (updates.availableColors) patch.cores = updates.availableColors;

        await supabase.from("produtos").update(patch).eq("id", id);
      } catch {}
    }

    return updatedProduct;
  },

  async delete(id: string): Promise<boolean> {
    const current = getStoredProducts();
    const filtered = current.filter((p) => p.id !== id);
    saveStoredProducts(filtered);

    if (isSupabaseConfigured && supabase && !id.startsWith("3d-custom")) {
      try {
        await supabase.from("produtos").delete().eq("id", id);
      } catch {}
    }

    return true;
  },
};
