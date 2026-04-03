"use client";

import { useState } from "react";
import axios from "axios";
import { useCartStore } from "@/store/cart-store";
import axiosClientPublic from "@/lib/axiosPublic";
import { toast } from "sonner";

interface CreateCheckoutResponse {
  ok: boolean;
  data: {
    reference: string;
    invoiceNumber: string;
    amountInCents: number;
    currency: string;
    publicKey: string;
    customerEmail: string;
    redirectUrl: string;
    signature: string;
    expirationTime?: string;
    taxInCents?: {
      vat?: number;
      consumption?: number;
    };
  };
}

const wompiLegalIdTypeMap: Record<string, string> = {
  CEDULA_CIUDADANIA: "CC",
  CEDULA_EXTRANJERIA: "CE",
  NIT: "NIT",
  PPT: "PP",
  RIF: "CC",
};

export function CheckoutPayButton() {
  const [loading, setLoading] = useState(false);

  const cart = useCartStore((state) => state.cart);
  const checkoutForm = useCartStore((state) => state.checkoutForm);

  const handlePay = async () => {
    try {
      if (typeof window === "undefined" || !window.WidgetCheckout) {
        throw new Error("El script de Wompi aún no está cargado");
      }

      if (
        !checkoutForm.fullName.trim() ||
        !checkoutForm.documentType.trim() ||
        !checkoutForm.documentNumber.trim() ||
        !checkoutForm.address.trim() ||
        !checkoutForm.email.trim() ||
        !checkoutForm.phone.trim() ||
        !checkoutForm.city.trim()
      ) {
        throw new Error("Completa todos los datos del cliente");
      }

      if (cart.length === 0) {
        throw new Error("Tu carrito está vacío");
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

      if (!data?.ok || !data?.data) {
        throw new Error("No se pudo iniciar el pago");
      }

      const userData = checkoutForm;
      const wompiData = data.data;

      const checkoutConfig: WidgetCheckoutOptions = {
        currency: wompiData.currency,
        amountInCents: wompiData.amountInCents,
        reference: wompiData.reference,
        publicKey: wompiData.publicKey,
        signature: {
          integrity: wompiData.signature,
        },
        redirectUrl: wompiData.redirectUrl,
        widgetOperation: "purchase",
        customerData: {
          email: wompiData.customerEmail || userData.email,
          fullName: userData.fullName,
          phoneNumber: userData.phone,
          phoneNumberPrefix: "+57",
          legalId: userData.documentNumber,
          legalIdType: wompiLegalIdTypeMap[userData.documentType] ?? "CC",
        },
        shippingAddress: {
          addressLine1: userData.address,
          country: "CO",
          city: userData.city,
          region: "Norte de Santander",
          phoneNumber: userData.phone,
          name: userData.fullName,
        },
      };

      if (wompiData.expirationTime) {
        checkoutConfig.expirationTime = wompiData.expirationTime;
      }

      if (wompiData.taxInCents) {
        checkoutConfig.taxInCents = wompiData.taxInCents;
      }

      const checkout = new window.WidgetCheckout(checkoutConfig);

      checkout.open((result: WompiWidgetResult) => {
        console.log("Wompi result:", result);

        const txStatus = result?.transaction?.status;
        const manualRedirectUrl =
          wompiData.redirectUrl ||
          `/checkout/resultado?invoiceNumber=${wompiData.invoiceNumber}`;

        if (txStatus === "APPROVED" || txStatus === "PENDING") {
          window.location.assign(manualRedirectUrl);
          return;
        }

        if (txStatus === "DECLINED" || txStatus === "ERROR") {
          toast.error("El pago no fue aprobado");
          return;
        }

        // fallback si no vino status pero sí hubo cierre del widget
        setTimeout(() => {
          window.location.assign(manualRedirectUrl);
        }, 800);
      });
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
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