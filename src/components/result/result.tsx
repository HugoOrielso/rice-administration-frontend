"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClientPublic from "@/lib/axiosPublic";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";

interface InvoiceApiResponse {
    ok: boolean;
    data: InvoiceResponseData;
}

function SimpleHeader() {
    return (
        <div className="w-full bg-white border-b shadow-sm py-4 px-6 flex items-center">
            <Link href="/" className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                    <Image
                        src="/assets/logo.png"
                        alt="Logo Andina Group"
                        fill
                        priority
                        sizes="56px"
                        className="object-contain"
                    />
                </div>

                <div>
                    <p className="text-lg font-extrabold tracking-tight text-(--color-brand-green)">
                        Andina group & Capital S.A.S
                    </p>
                    <p className="text-sm text-slate-500">
                        Tradición, calidad y confianza
                    </p>
                </div>
            </Link>
        </div>
    );
}

export default function ResultadoContent() {
    const params = useSearchParams();
    const router = useRouter();
    const alreadyHandledRef = useRef(false);

    const resetAll = useCartStore((state) => state.resetAll);

    const invoiceIdentifier = params.get("reference");

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

                const isPaid =
                    invoiceData.status === "PAID" ||
                    invoiceData.status === "APPROVED";

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

    const isPaid =
        invoice.status === "PAID" || invoice.status === "APPROVED";

    const isRejected =
        invoice.status === "FAILED" ||
        invoice.status === "DECLINED" ||
        invoice.status === "ERROR";

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0f5c3b] via-[#0d6b3f] to-[#1f7a3a]">
            <SimpleHeader />

            <div className="flex justify-center px-4 py-10">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {isPaid ? "🎉 ¡Gracias por tu compra!" : "Gracias por tu pedido"}
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Factura #{invoice.invoiceNumber}
                        </p>
                    </div>

                    <div className="text-center mb-6">
                        {isPaid && (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                Pago aprobado
                            </span>
                        )}

                        {invoice.status === "PENDING" && (
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                Pago pendiente
                            </span>
                        )}

                        {isRejected && (
                            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                Pago no aprobado
                            </span>
                        )}
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
                        <h2 className="font-semibold mb-3 text-gray-800">
                            Detalle del pedido
                        </h2>

                        {invoice.items.map((item: InvoiceItemResponse) => (
                            <div
                                key={item.id}
                                className="flex justify-between py-3 border-b"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{item.productName}</p>
                                    <p className="text-sm text-gray-500">
                                        Cantidad: {item.quantity}
                                    </p>

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
                            className="flex-1 px-5 py-3 bg-black text-white rounded-xl cursor-pointer"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}