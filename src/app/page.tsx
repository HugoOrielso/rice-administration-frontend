"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "@/components/home/About";
import { BenefitsSection } from "@/components/home/Benefits";
import { CTASection } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/ProductsSection";
import { getPublicProducts } from "@/services/products";

export default function HomePage() {
  const [products, setProducts] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getPublicProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading public products:", error);
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

      {!loading && products.length === 0 && (
        <div
          className="mx-auto my-8 max-w-2xl border-l-4 border-red-400 bg-red-50 p-4 text-red-700"
          role="alert"
        >
          <p className="font-bold">No hay productos disponibles</p>
          <p>Lo sentimos, no pudimos cargar los productos en este momento.</p>
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