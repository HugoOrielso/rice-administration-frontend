"use client";

import Image from "next/image";
import { useCartStore, Product } from "@/store/cart-store";
import { FloatingCartButton } from "../cart/FloatingCartButton";
import { CartSidebar } from "../cart/CartSidebar";
import { toast } from "sonner";

interface ProductsSectionProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductsSection({ products }: ProductsSectionProps) {

  const addToCart = useCartStore((state) => state.addToCart);
  const isOpen = useCartStore((state) => state.isOpen);
  const checkoutStep = useCartStore((state) => state.checkoutStep);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const goToCheckout = useCartStore((state) => state.goToCheckout);
  const goToCart = useCartStore((state) => state.goToCart);
  const cart = useCartStore((state) => state.cart);
  const checkoutForm = useCartStore((state) => state.checkoutForm);
  const setCheckoutField = useCartStore((state) => state.setCheckoutField);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const totalItems = useCartStore((state) => state.totalItems());


  const handleSubmitCheckout = () => {

    toast.success("Formulario listo. Luego aquí conectamos el pago.");
  };

  return (
    <>
      <section id="productos" className="bg-slate-50 scroll-mt-20 py-18 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Nuestros productos
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Presentaciones destacadas de Arroz Zulia
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Una selección pensada para responder a distintas necesidades de
              consumo, con empaque atractivo y calidad consistente.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <FloatingCartButton count={totalItems} onClick={openCart} />

      <CartSidebar
        isOpen={isOpen}
        checkoutStep={checkoutStep}
        onClose={closeCart}
        onGoToCheckout={goToCheckout}
        onGoToCart={goToCart}
        cart={cart}
        form={checkoutForm}
        onChangeField={setCheckoutField}
        onSubmitCheckout={handleSubmitCheckout}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
      />
    </>
  );
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-linear-to-br from-emerald-100 via-lime-50 to-yellow-50 p-8">
        <div className="relative mx-auto h-80 w-full max-w-65">
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain transition duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-extrabold text-slate-900">
            {product.name}
          </h3>
          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
            Disponible
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          {product.description}
        </p>

        <p className="mt-4 text-sm font-semibold text-emerald-700">
          {product.presentation}
        </p>

        <p className="mt-2 text-lg font-extrabold text-slate-900">
          ${product.price.toLocaleString("es-CO")}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => onAddToCart(product)}
            className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}