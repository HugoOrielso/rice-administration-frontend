"use client";
import { useCartStore, ProductCardItem } from "@/store/cart-store";
import { toast } from "sonner";
import { FloatingCartButton } from "../cart/FloatingCartButton";
import { CartSidebar } from "../cart/CartSidebar";
import { ProductCard } from "./ProductCart";

interface ProductsSectionProps {
  products: ProductCardItem[];
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
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const totalItems = useCartStore((state) => state.totalItems());


  const handleAddToCart = (product: ProductCardItem) => {
    const result = addToCart(product);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Producto agregado al carrito");
  };

  const handleIncreaseQuantity = (id: string) => {
    const result = increaseQuantity(id);

    if (!result.ok) {
      toast.error(result.message || "No se puede agregar más unidades.");
    }
  };
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

          <div className="mt-5  gap-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] ">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>


      <FloatingCartButton
        count={hasHydrated ? totalItems : 0}
        onClick={openCart}
      />
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
        onIncrease={handleIncreaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
      />
    </>
  );
}

