interface ProductApiResponse {
  id: string;
  name: string;
  details?: string | null;
  imageUrl?: string | null;
  packageLabel?: string | null;
  unitsPerPackage?: number | null;
  unitWeightGrams?: number | null;
  price: number;
  isActive: boolean;
  stock: number;
}

interface ProductCardItem {
  id: string;
  name: string;
  description: string;
  presentation: string;
  image: string;
  price: number;
  stock: number;
}

