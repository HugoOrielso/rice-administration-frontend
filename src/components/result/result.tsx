"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClientPublic from "@/lib/axiosPublic";
import { useCartStore } from "@/store/cart-store";
import { InvoiceStatus } from "@/types/checkout";
import { StatusMessage } from "./statusMessage";
import { StatusBadge } from "./statusBadge";
import { StatusTitle } from "./statusTitle";
import { SimpleHeader } from "./header";

interface InvoiceApiResponse {
    ok: boolean;
    data: InvoiceResponseData;
}



export default function ResultadoContent() {
    const params = useSearchParams();
    const router = useRouter();
    const alreadyHandledRef = useRef(false);
    const resetAll = useCartStore((state) => state.resetAll);
    const invoiceIdentifier = params.get("result");

    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState<InvoiceResponseData | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                if (!invoiceIdentifier) {
                    throw new Error("No se encontró el identificador de la factura");
                }

                const { data } = await axiosClientPublic.get<InvoiceApiResponse>(
                    `/invoices/${invoiceIdentifier}`
                );

                if (!data?.ok || !data?.data) {
                    throw new Error("Respuesta inválida del servidor");
                }

                const invoiceData = data.data;
                setInvoice(invoiceData);

                const isPaid = invoiceData.status === "PAID" || invoiceData.status === "APPROVED";

                if (isPaid && !alreadyHandledRef.current) {
                    alreadyHandledRef.current = true;
                    resetAll();
                }
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [invoiceIdentifier, resetAll]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#0f5c3b] via-[#0d6b3f] to-[#1f7a3a]">
                <SimpleHeader />
                <div className="flex items-center justify-center px-4 py-16 text-white">
                    Verificando pago...
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#0f5c3b] via-[#0d6b3f] to-[#1f7a3a]">
                <SimpleHeader />
                <div className="flex flex-col items-center justify-center px-6 py-16 text-white">
                    <h1 className="text-2xl font-semibold">Error cargando factura</h1>
                    <p className="mt-2 text-white/80 text-center">
                        No pudimos obtener la información del pago.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-6 px-6 py-3 bg-white text-black rounded-xl cursor-pointer"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    const status = invoice.status as InvoiceStatus;
    const isPaid = status === "PAID" || status === "APPROVED";

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0f5c3b] via-[#0d6b3f] to-[#1f7a3a]">
            <SimpleHeader />

            <div className="flex justify-center px-4 py-10">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">

                    <div className="text-center mb-2">
                        <StatusTitle status={status} />
                        <p className="text-gray-500 mt-2">Factura #{invoice.invoiceNumber}</p>
                    </div>

                    <div className="text-center mb-2">
                        <StatusBadge status={status} />
                    </div>

                    <div className="text-center mb-6">
                        <StatusMessage status={status} />
                    </div>

                    <div className="mb-6 space-y-1">
                        <p className="font-semibold text-gray-800">{invoice.customerName}</p>
                        <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                        <p className="text-sm text-gray-500">{invoice.customerPhone}</p>
                        <p className="text-sm text-gray-500">{invoice.customerAddress}</p>
                        <p className="text-sm text-gray-500">
                            {invoice.documentType}: {invoice.documentNumber}
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <h2 className="font-semibold mb-3 text-gray-800">Detalle del pedido</h2>

                        {invoice.items.map((item: InvoiceItemResponse) => (
                            <div key={item.id} className="flex justify-between py-3 border-b">
                                <div>
                                    <p className="font-medium text-gray-800">{item.productName}</p>
                                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                    {item.packageLabel && (
                                        <p className="text-sm text-gray-500">
                                            Presentación: {item.packageLabel}
                                        </p>
                                    )}
                                </div>
                                <p className="font-semibold text-gray-800">
                                    ${item.lineTotal.toLocaleString("es-CO")}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>${invoice.subtotal.toLocaleString("es-CO")}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-800">
                            <span>Total</span>
                            <span>${invoice.total.toLocaleString("es-CO")}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={() => router.push("/")}
                            className={`px-5 py-3 rounded-xl cursor-pointer ${isPaid ? "flex-1 bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}