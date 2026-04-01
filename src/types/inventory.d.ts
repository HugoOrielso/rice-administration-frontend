// types/product.ts
interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  details?: string | null;
  price: string | number;
  stock: number;
  minStock: number;
  packageLabel?: string | null;
  unitsPerPackage?: number | null;
  unitWeightGrams?: string | number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};