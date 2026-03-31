"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { CartItem, CheckoutFormData } from "@/store/cart-store";
import { CheckoutForm } from "../checkout/CheckoutForm";

interface CartSidebarProps {
  isOpen: boolean;
  checkoutStep: "cart" | "checkout";
  onClose: () => void;
  onGoToCheckout: () => void;
  onGoToCart: () => void;
  cart: CartItem[];
  form: CheckoutFormData;
  onChangeField: (field: keyof CheckoutFormData, value: string) => void;
  onSubmitCheckout: () => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export function CartSidebar({
  isOpen,
  checkoutStep,
  onClose,
  onGoToCheckout,
  onGoToCart,
  cart,
  form,
  onChangeField,
  onSubmitCheckout,
  onIncrease,
  onDecrease,
  onRemove,
}: CartSidebarProps) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-4 right-4 bottom-4 z-50 h-auto w-full max-w-md transform rounded-4xl border border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        {checkoutStep === "checkout" ? (
          <CheckoutForm
            form={form}
            totalPrice={totalPrice}
            onBack={onGoToCart}
            onChange={onChangeField}
            onSubmit={onSubmitCheckout}
          />
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {totalItems} producto{totalItems !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 text-lg font-bold text-slate-800">
                    Tu carrito está vacío
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Agrega productos para comenzar tu pedido.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-slate-200 p-4 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="line-clamp-2 text-sm font-extrabold text-slate-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-xs text-emerald-700">
                                {item.presentation}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-slate-700">
                                ${item.price.toLocaleString("es-CO")}
                              </p>
                            </div>

                            <button
                              onClick={() => onRemove(item.id)}
                              className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-slate-200">
                              <button
                                onClick={() => onDecrease(item.id)}
                                className="px-3 py-2 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => onIncrease(item.id)}
                                className="px-3 py-2 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-sm font-extrabold text-slate-900">
                              ${(item.quantity * item.price).toLocaleString("es-CO")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Total</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  ${totalPrice.toLocaleString("es-CO")}
                </span>
              </div>

              <button
                onClick={onGoToCheckout}
                disabled={cart.length === 0}
                className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ir al checkout
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}