import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem extends ProductCardItem {
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  documentType:
    | "REGISTRO_CIVIL"
    | "TARJETA_EXTRANJERIA"
    | "CEDULA_CIUDADANIA"
    | "CEDULA_EXTRANJERIA"
    | "NIT"
    | "PASAPORTE"
    | "TARJETA_IDENTIDAD"
    | "DNI"
    | "CARTEIRA_IDENTIDADE"
    | "OTRO"
    | "";
  documentNumber: string;
  address: string;
  email: string;
  phone: string;
  phonePrefix: string;
  city: string;
  department: string;
  country: string;
}

export interface WompiSessionData {
  sessionId: string;
  deviceId: string;
}

export interface OrderSummary {
  reference: string;
  createdAt: string;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  checkoutStep: "cart" | "checkout";
  checkoutForm: CheckoutFormData;
  wompiSession: WompiSessionData | null;
  orderSummary: OrderSummary | null;
  hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  goToCheckout: () => void;
  goToCart: () => void;

  setCheckoutField: (field: keyof CheckoutFormData, value: string) => void;
  setCheckoutForm: (data: Partial<CheckoutFormData>) => void;
  resetCheckoutForm: () => void;

  setWompiSession: (data: WompiSessionData | null) => void;
  setOrderSummary: (data: OrderSummary | null) => void;

  addToCart: (product: ProductCardItem) => { ok: boolean; message?: string };
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => { ok: boolean; message?: string };
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  resetAll: () => void;

  totalItems: () => number;
  totalPrice: () => number;
}

const initialCheckoutForm: CheckoutFormData = {
  fullName: "",
  documentType: "",
  documentNumber: "",
  address: "",
  email: "",
  phone: "",
  phonePrefix: "+57",
  city: "",
  department: "",
  country: "Colombia", // ← antes era "CO"
};
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      checkoutStep: "cart",
      checkoutForm: initialCheckoutForm,
      wompiSession: null,
      orderSummary: null,
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

      setCheckoutForm: (data) =>
        set((state) => ({
          checkoutForm: {
            ...state.checkoutForm,
            ...data,
          },
        })),

      resetCheckoutForm: () => set({ checkoutForm: initialCheckoutForm }),

      setWompiSession: (data) => set({ wompiSession: data }),

      setOrderSummary: (data) => set({ orderSummary: data }),

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

      resetAll: () =>
        set({
          cart: [],
          isOpen: false,
          checkoutStep: "cart",
          checkoutForm: initialCheckoutForm,
          wompiSession: null,
          orderSummary: null,
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