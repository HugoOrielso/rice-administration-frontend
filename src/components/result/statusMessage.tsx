import { InvoiceStatus } from "@/types/checkout";

export function StatusMessage({ status }: { status: InvoiceStatus }) {
    const messages: Record<InvoiceStatus, string> = {
        PAID:      "Tu pedido ha sido confirmado y está siendo procesado.",
        APPROVED:  "Tu pedido ha sido confirmado y está siendo procesado.",
        PENDING:   "Estamos verificando tu pago. Te notificaremos cuando se confirme.",
        DECLINED:  "Tu banco declinó el pago. Intenta con otra tarjeta o método de pago.",
        ERROR:     "Hubo un error procesando tu pago. Por favor intenta nuevamente.",
        CANCELLED: "El pago fue cancelado. Puedes volver e intentarlo de nuevo.",
        REFUNDED:  "Tu reembolso está siendo procesado. Puede tardar algunos días hábiles.",
        EXPIRED:   "El enlace de pago venció. Por favor genera un nuevo pedido.",
    };

    const message = messages[status];
    if (!message) return null;

    const colorMap: Record<InvoiceStatus, string> = {
        PAID:      "text-green-700 bg-green-50",
        APPROVED:  "text-green-700 bg-green-50",
        PENDING:   "text-yellow-700 bg-yellow-50",
        DECLINED:  "text-red-700 bg-red-50",
        ERROR:     "text-red-700 bg-red-50",
        CANCELLED: "text-gray-600 bg-gray-50",
        REFUNDED:  "text-blue-700 bg-blue-50",
        EXPIRED:   "text-orange-700 bg-orange-50",
    };

    return (
        <p className={`mt-4 text-sm rounded-xl px-4 py-3 ${colorMap[status]}`}>
            {message}
        </p>
    );
}