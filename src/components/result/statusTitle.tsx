import { InvoiceStatus } from "@/types/checkout";

export function StatusTitle({ status }: { status: InvoiceStatus }) {
    const titles: Record<InvoiceStatus, string> = {
        PAID:      "🎉 ¡Gracias por tu compra!",
        APPROVED:  "🎉 ¡Gracias por tu compra!",
        PENDING:   "⏳ Tu pago está en proceso",
        DECLINED:  "😕 Tu pago fue declinado",
        ERROR:     "⚠️ Ocurrió un error con el pago",
        CANCELLED: "🚫 Pago cancelado",
        REFUNDED:  "↩️ Tu pago fue reembolsado",
        EXPIRED:   "⏰ El enlace de pago expiró",
    };

    return (
        <h1 className="text-2xl font-bold text-gray-800">
            {titles[status] ?? "Gracias por tu pedido"}
        </h1>
    );
}