import { AboutSection } from "@/components/home/About";
import { BenefitsSection } from "@/components/home/Benefits";
import { CTASection } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/Products";

export default function HomePage() {
  const products = [
    {
      id: 1,
      name: 'Arroz Zulia Fortificado',
      description:
        'Arroz fortificado con ácido fólico y riboflavina, elaborado bajo altos estándares de calidad para acompañar la mesa de las familias colombianas.',
      image: '/assets/product-1.png',
      presentation: 'Presentación: 900 g',
    },
    {
      id: 2,
      name: 'Arroz Zulia Blanco Gourmet',
      description:
        'Arroz blanco tipo gourmet, seleccionado por expertos arroceros del Norte de Santander para ofrecer excelente textura, sabor y rendimiento.',
      image: '/assets/product-2.png',
      presentation: 'Presentación: 500 g',
    },
  ];

  return (
    <div className="">
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