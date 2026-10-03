import type { Product } from "./interfaces/Product";

export const getVariantImages = (product: Product, color: string, painted: boolean) => {
  const images = product.imagesByVariant?.[painted ? "Pintada" : color] || [];
  return images.length ? images : product.imageUrl ? [product.imageUrl] : [];
};
