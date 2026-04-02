import { AboutSection } from "@/components/home/About";
import { BenefitsSection } from "@/components/home/Benefits";
import { CTASection } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/ProductsSection";
import axiosClientPublic from "@/lib/axiosPublic";

async function getProducts() {
  try {
    const res = await axiosClientPublic.get(`/products`);


    const data: ApiProduct[] = await res.data

    return data
      .filter((product) => product.isActive)
      .map((product) => ({
        id: product.id,
        name: product.name,
        description:
          product.details?.trim() || "Producto disponible en inventario.",
        image: product.imageUrl ?? '/assets/product-placeholder.jpg',
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

export default async function HomePage() {
  const products = await getProducts();
  return (
    <div>
      <Header />
      <Hero />
      {
        products.length === 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 my-8 mx-auto max-w-2xl" role="alert">
            <p className="font-bold">No hay productos disponibles</p>
            <p>Lo sentimos, no pudimos cargar los productos en este momento. Por favor, intenta recargar la página o vuelve más tarde.</p>
          </div>
        )
      }
      {
        products.length > 0 &&
        <ProductsSection products={products} />
      }
      <BenefitsSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}