interface ApiProduct {
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
};

