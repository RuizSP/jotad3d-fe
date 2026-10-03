export interface Product {
  id: string;
  name: string;
  price: number;
  paintingPrice?: number | null;
  description?: string;
  category: string;
  imageUrl: string;
  imagesByVariant?: Record<string, string[]>;
  availableColors?: string[];
  dimensions?: string;
  printTimeHours?: number | null;
  material?: string;
  inStock?: boolean;
}
