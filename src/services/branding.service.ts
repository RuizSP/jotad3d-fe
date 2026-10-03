import { supabase } from "./supabase";
import type { Branding } from "../shared/interfaces/Branding";

interface BrandingRow {
  company_name: string;
  tagline: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_highlight: string;
  hero_description: string;
  quote_payment_text: string;
  quote_delivery_text: string;
  logo_url: string | null;
  theme_name: Branding["themeName"];
  accent_color: string;
}

const BUCKET = "brand-assets";

export const brandingService = {
  async get(): Promise<Branding | null> {
    if (!supabase) throw new Error("Supabase não está configurado.");
    const { data, error } = await supabase
      .from("store_branding")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as BrandingRow;
    return {
      companyName: row.company_name,
      tagline: row.tagline,
      heroEyebrow: row.hero_eyebrow,
      heroTitle: row.hero_title,
      heroHighlight: row.hero_highlight,
      heroDescription: row.hero_description,
      quotePaymentText: row.quote_payment_text,
      quoteDeliveryText: row.quote_delivery_text,
      logoUrl: row.logo_url,
      themeName: row.theme_name,
      accentColor: row.accent_color,
    };
  },

  async save(branding: Branding): Promise<void> {
    if (!supabase) throw new Error("Supabase não está configurado.");
    const { error } = await supabase.from("store_branding").upsert({
      id: 1,
      company_name: branding.companyName.trim(),
      tagline: branding.tagline.trim(),
      hero_eyebrow: branding.heroEyebrow.trim(),
      hero_title: branding.heroTitle.trim(),
      hero_highlight: branding.heroHighlight.trim(),
      hero_description: branding.heroDescription.trim(),
      quote_payment_text: branding.quotePaymentText.trim(),
      quote_delivery_text: branding.quoteDeliveryText.trim(),
      logo_url: branding.logoUrl,
      theme_name: branding.themeName,
      accent_color: branding.accentColor.toUpperCase(),
    });
    if (error) throw error;
  },

  async uploadLogo(file: File): Promise<string> {
    if (!supabase) throw new Error("Supabase não está configurado.");
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      throw new Error("Envie um PNG, JPEG ou WebP de até 2 MB.");
    }
    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";
    const path = `logos/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });
    if (error) throw error;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  },
};
