import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  name: string;
  description: string;
  presentation: string;
  image: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  cc: string;
  address: string;
  email: string;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  checkoutStep: "cart" | "checkout";
  checkoutForm: CheckoutFormData;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  goToCheckout: () => void;
  goToCart: () => void;

  setCheckoutField: (field: keyof CheckoutFormData, value: string) => void;
  resetCheckoutForm: () => void;

  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;

  totalItems: () => number;
  totalPrice: () => number;
}

const initialCheckoutForm: CheckoutFormData = {
  fullName: "",
  cc: "",
  address: "",
  email: "",
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      checkoutStep: "cart",
      checkoutForm: initialCheckoutForm,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false, checkoutStep: "cart" }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      goToCheckout: () => set({ checkoutStep: "checkout" }),
      goToCart: () => set({ checkoutStep: "cart" }),

      setCheckoutField: (field, value) =>
        set((state) => ({
          checkoutForm: {
            ...state.checkoutForm,
            [field]: value,
          },
        })),

      resetCheckoutForm: () => set({ checkoutForm: initialCheckoutForm }),

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
            isOpen: true,
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () =>
        set({
          cart: [],
          checkoutStep: "cart",
        }),

      totalItems: () =>
        get().cart.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () =>
        get().cart.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        ),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        checkoutForm: state.checkoutForm,
      }),
    }
  )
);