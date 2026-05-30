export type PriceCategory = 'small' | 'medium' | 'large' | 'premium';

export type ImageFit = 'contain' | 'cover';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: PriceCategory;
  images: string[];
  buyUrl: string;
  addedAt: string;
  /** How the product image fills its card frame. Default `contain` shows the
   *  whole product (with letterboxing). Use `cover` when the photo is a
   *  full-bleed lifestyle shot where cropping is fine. */
  imageFit?: ImageFit;
};
