import { AboutSection } from "@/components/home/About";
import { BenefitsSection } from "@/components/home/Benefits";
import { CTASection } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/ProductsSection";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    });

    if (!res.ok) {
      throw new Error("No se pudieron obtener los productos");
    }

    const data: ApiProduct[] = await res.json();

    return data
      .filter((product) => product.isActive)
      .map((product) => ({
        id: product.id,
        name: product.name,
        description:
          product.details?.trim() || "Producto disponible en inventario.",
        image: product.imageUrl
          ? `${process.env.NEXT_PUBLIC_API_URL_IMAGES}${product.imageUrl}`
          : "/assets/product-placeholder.png",
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
  } catch  {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  return (
    <div>
      <Header />
      <Hero />
      <ProductsSection products={products} />
      <BenefitsSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
}