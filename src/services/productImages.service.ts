import { supabase } from "./supabase";

const BUCKET = "produtos-imagens";
const MAX_SIZE = 10 * 1024 * 1024;

export const productImagesService = {
  pathFromUrl(url: string, productId: string): string | null {
    if (!supabase) return null;
    const prefix = supabase.storage.from(BUCKET).getPublicUrl(`${productId}/`).data.publicUrl;
    return url.startsWith(prefix) ? `${productId}/${decodeURIComponent(url.slice(prefix.length))}` : null;
  },

  async upload(file: File, productId: string): Promise<{ url: string; path: string }> {
    if (!supabase) throw new Error("Supabase não está configurado.");
    if (!file.type.startsWith("image/") || file.size > MAX_SIZE) {
      throw new Error("Envie uma imagem de até 10 MB.");
    }
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${productId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
    });
    if (error) throw error;
    return { path, url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
  },

  async remove(paths: string[]) {
    if (!supabase || paths.length === 0) return;
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) throw error;
  },
};
