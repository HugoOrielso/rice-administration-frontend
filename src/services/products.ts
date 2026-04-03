import axiosClientPublic from "@/lib/axiosPublic";

export async function getPublicProducts(): Promise<ProductCardItem[]> {
  try {
    const res = await axiosClientPublic.get("/products");
    const data: ProductApiResponse[] = res.data;

    return data
      .map((product) => ({
        id: product.id,
        name: product.name,
        description:
          product.details?.trim() || "Producto disponible en inventario.",
        image: product.imageUrl ?? "/assets/product-placeholder.jpg",
        presentation: [
          product.packageLabel,
          product.unitsPerPackage
            ? `${product.unitsPerPackage} unidades`
            : null,
          product.unitWeightGrams
            ? `${product.unitWeightGrams} g`
            : null,
        ]
          .filter(Boolean)
          .join(" · "),
        price: product.price,
        stock: product.stock,
      }));
  } catch {
    return [];
  }
}