/* eslint-disable @next/next/no-img-element */
"use client";

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
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
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
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-3 right-3 left-3 z-50 w-auto transform rounded-[2rem] border border-slate-200 bg-white shadow-2xl transition-transform duration-300 sm:left-auto sm:w-full sm:max-w-md ${isOpen ? "translate-x-0" : "translate-x-[110%]"
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
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900 sm:text-xl">
                  <ShoppingCart className="h-5 w-5 shrink-0" />
                  <span className="truncate">Carrito</span>
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {totalItems} producto{totalItems !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-1.5">
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
                  {cart.map((item) => {
                    const maxReached = item.quantity >= item.stock;
                    const noStock = item.stock <= 0;

                    return (
                      <div
                        key={item.id}
                        className="rounded-sm relative border border-slate-200 p-1 shadow-sm sm:p-1"
                      >
                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="absolute right-0.5 top-0.5 z-10 rounded-sm p-0.5 border transition bg-red-50 text-red-600 "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center ">
                          <div>

                            <div className="h-20 w-20 items-center justify-center flex shrink-0 overflow-hidden rounded-2xl bg-slate-50 sm:h-24 sm:w-24">

                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 flex flex-col gap-2 ">
                            <div className="flex items-start justify-between gap-1">
                              <div className="min-w-0 flex-1">
                                <h3 className="line-clamp-2 text-xs md:text-sm font-extrabold uppercase text-slate-900 sm:text-base">
                                  {item.name}
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-emerald-700 sm:text-sm">
                                  {item.presentation}
                                </p>

                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                  {noStock
                                    ? "Sin stock"
                                    : `Stock disponible: ${item.stock}`}
                                </p>
                              </div>
                            </div>

                            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center ">
                              <div className="flex items-center justify-center gap-2">
                                <div className="flex w-fit items-center rounded-full border border-slate-200">
                                  <button
                                    type="button"
                                    onClick={() => onDecrease(item.id)}
                                    className="px-1.5 text-slate-600 transition hover:bg-slate-50"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>

                                  <span className="min-w-6 text-center text-sm font-bold text-slate-900">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() => onIncrease(item.id)}
                                    className={`px-1.5 transition ${noStock || maxReached
                                        ? "text-slate-400"
                                        : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    title={
                                      noStock
                                        ? "Producto sin stock"
                                        : maxReached
                                          ? "Llegaste al máximo disponible"
                                          : "Agregar una unidad"
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-left text-sm font-extrabold text-slate-900 sm:text-right">
                                  ${item.price.toLocaleString("es-CO")}
                                </p>
                              </div>

                              <div className="flex items-center justify-center">
                                <p className="text-left text-sm font-extrabold text-slate-900 sm:text-right">
                                  ${(item.quantity * item.price).toLocaleString("es-CO")}
                                </p>
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">Total</span>
                <span className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  ${totalPrice.toLocaleString("es-CO")}
                </span>
              </div>

              <button
                type="button"
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