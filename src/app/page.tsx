import { AboutSection } from "@/components/home/About";
import { BenefitsSection } from "@/components/home/Benefits";
import { CTASection } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/ProductsSection";
import { getPublicProducts } from "@/services/products";

export default async function HomePage() {
  const products = await getPublicProducts();

  return (
    <div>
      <Header />
      <Hero />

      {products.length === 0 && (
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

      {products.length > 0 && <ProductsSection products={products} />}

      <BenefitsSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}