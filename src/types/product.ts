export type PriceCategory = 'small' | 'medium' | 'large' | 'premium';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: PriceCategory;
  images: string[];
  buyUrl: string;
  addedAt: string;
};
