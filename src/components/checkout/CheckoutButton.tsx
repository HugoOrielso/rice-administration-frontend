"use client";

import { useState } from "react";
import axios from "axios";
import { useCartStore } from "@/store/cart-store";
import axiosClientPublic from "@/lib/axiosPublic";
import { toast } from "sonner";

interface CreateCheckoutResponse {
  ok: boolean;
  data: {
    paymentUrl: string;
    reference: string;
    invoiceId: string;
  };
}

export function CheckoutPayButton() {
  const [loading, setLoading] = useState(false);

  const cart = useCartStore((state) => state.cart);
  const checkoutForm = useCartStore((state) => state.checkoutForm);

  const handlePay = async () => {
    try {
      if (
        !checkoutForm.fullName.trim() ||
        !checkoutForm.documentType.trim() ||
        !checkoutForm.documentNumber.trim() ||
        !checkoutForm.address.trim() ||
        !checkoutForm.email.trim() ||
        !checkoutForm.phone.trim() ||
        !checkoutForm.phonePrefix.trim() ||
        !checkoutForm.city.trim() ||
        !checkoutForm.country.trim() ||
        !checkoutForm.department.trim()
      ) {
        toast.error("Completa todos los datos del cliente");
        return;
      }

      if (cart.length === 0) {
        toast.error("Tu carrito está vacío");
        return;
      }

      setLoading(true);

      const { data } = await axiosClientPublic.post<CreateCheckoutResponse>(
        "/payments/wompi/checkout",
        {
          customer: checkoutForm,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }
      );

      if (!data?.ok || !data?.data?.paymentUrl) {
        throw new Error("No se pudo iniciar el pago");
      }

      window.location.assign(data.data.paymentUrl);

    } catch (error: unknown) {
      console.error("❌ error en handlePay:", error);

      if (axios.isAxiosError(error)) {
        console.error("❌ axios error response:", error.response?.data);
        toast.error(error.response?.data?.message || "Error al iniciar el pago");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Error al iniciar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading || cart.length === 0}
      className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
    >
      {loading ? "Iniciando pago..." : "Pagar ahora"}
    </button>
  );
}