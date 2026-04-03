// src/types/wompi.d.ts
export { };

declare global {
  interface Window {
    $wompi?: WompiJsInstance;
    WidgetCheckout?: new (
      options: WidgetCheckoutOptions
    ) => WidgetCheckoutInstance;
  }

  interface WompiJsInstance {
    initialize: (
      callback: (
        data: {
          sessionId: string;
          deviceData: {
            deviceID: string;
          };
        },
        error: unknown
      ) => void
    ) => void;
  }

  interface WidgetCheckoutOptions {
    currency: string;
    amountInCents: number;
    reference: string;
    publicKey: string;
    widgetOperation?: "purchase";

    signature?: {
      integrity: string;
    };

    redirectUrl?: string;
    expirationTime?: string;

    customerData?: WompiCustomerData;
    shippingAddress?: WompiShippingAddress;
    taxInCents?: WompiTaxInCents;
  }

  interface WompiCustomerData {
    email: string;
    fullName?: string;
    phoneNumber?: string;
    phoneNumberPrefix?: string;
    legalId?: string;
    legalIdType?: string;
  }

  interface WompiShippingAddress {
    addressLine1: string;
    addressLine2?: string;
    country: string;
    region: string;
    city: string;
    phoneNumber: string;
    name: string;
  }

  interface WompiTaxInCents {
    vat?: number;
    consumption?: number;
  }

  interface WidgetCheckoutInstance {
    open: (callback?: (result: WompiWidgetResult) => void) => void;
  }

  interface WompiWidgetResult {
    transaction?: {
      id: string;
      status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
      reference: string;
      amount_in_cents: number;
      currency: string;
      customer_email: string;
      payment_method_type?: string;
    };
  }
}