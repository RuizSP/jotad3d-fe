export interface ProductColor {
  name: string;
  hex: string;
}

export const PRODUCT_COLORS: ProductColor[] = [
  { name: "Preto", hex: "#111111" },
  { name: "Branco", hex: "#F5F5F5" },
  { name: "Rosa", hex: "#E91E63" },
  { name: "Azul", hex: "#1976D2" },
  { name: "Azul Bebê", hex: "#81D4FA" },
  { name: "Verde com Violeta", hex: "#7B1FA2" },
  { name: "Azul com Rosa", hex: "#5C6BC0" },
  { name: "Dourado", hex: "#D4AF37" },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  paintingPrice?: number;
  description?: string;
  category: string;
  imageUrl: string;
  availableColors?: string[];
  dimensions?: string;
  printTimeHours?: number;
  material?: string;
  inStock?: boolean;
}
