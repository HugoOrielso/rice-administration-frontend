import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  presentation: string;
  image: string;
  price: number;
  stock: number;
}

export interface CartItem extends ApiProduct {
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  documentType: "CEDULA_CIUDADANIA" | "NIT" | "CEDULA_EXTRANJERIA" | "RIF" | "PPT";
  documentNumber: string;
  address: string;
  email: string;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  checkoutStep: "cart" | "checkout";
  checkoutForm: CheckoutFormData;
  hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  goToCheckout: () => void;
  goToCart: () => void;

  setCheckoutField: (field: keyof CheckoutFormData, value: string) => void;
  resetCheckoutForm: () => void;

  addToCart: (product: ApiProduct) => { ok: boolean; message?: string };
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => { ok: boolean; message?: string };
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;

  totalItems: () => number;
  totalPrice: () => number;
}

const initialCheckoutForm: CheckoutFormData = {
  fullName: "",
  documentType: "CEDULA_CIUDADANIA",
  documentNumber: "",
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
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      openCart: () => set({ isOpen: true }),

      closeCart: () =>
        set({
          isOpen: false,
          checkoutStep: "cart",
        }),

      toggleCart: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

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

      addToCart: (product) => {
        const existing = get().cart.find((item) => item.id === product.id);

        if (product.stock <= 0) {
          return {
            ok: false,
            message: "Este producto no tiene stock disponible.",
          };
        }

        if (existing) {
          if (existing.quantity >= product.stock) {
            return {
              ok: false,
              message: `Solo hay ${product.stock} unidades disponibles.`,
            };
          }

          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          }));

          return { ok: true };
        }

        set((state) => ({
          cart: [...state.cart, { ...product, quantity: 1 }],
          isOpen: true,
        }));

        return { ok: true };
      },

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      increaseQuantity: (id) => {
        const item = get().cart.find((product) => product.id === id);

        if (!item) {
          return {
            ok: false,
            message: "Producto no encontrado en el carrito.",
          };
        }

        if (item.quantity >= item.stock) {
          return {
            ok: false,
            message: `Solo hay ${item.stock} unidades disponibles.`,
          };
        }

        set((state) => ({
          cart: state.cart.map((product) =>
            product.id === id
              ? { ...product, quantity: product.quantity + 1 }
              : product
          ),
        }));

        return { ok: true };
      },

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
        get().cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        checkoutForm: state.checkoutForm,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);