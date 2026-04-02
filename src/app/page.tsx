"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "@/components/home/About";
import { BenefitsSection } from "@/components/home/Benefits";
import { CTASection } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/ProductsSection";
import axiosClientPublic from "@/lib/axiosPublic";

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

export default function HomePage() {
  const [products, setProducts] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axiosClientPublic.get("/products");
        const data: ProductApiResponse[] = res.data;

        console.log("RAW PRODUCTS:", data);

        const mapped: ProductCardItem[] = data
          .filter((product) => product.isActive)
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

        console.log("MAPPED PRODUCTS:", mapped);
        setProducts(mapped);
      } catch (error) {
        console.error("ERROR LOADING PRODUCTS:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      <Header />
      <Hero />

      {loading && (
        <p className="text-center py-10">Cargando productos...</p>
      )}

      {!loading && products.length === 0 && (
        <div
          className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 my-8 mx-auto max-w-2xl"
          role="alert"
        >
          <p className="font-bold">No hay productos disponibles</p>
          <p>
            Lo sentimos, no pudimos cargar los productos en este momento.
          </p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <ProductsSection products={products} />
      )}

      <BenefitsSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}