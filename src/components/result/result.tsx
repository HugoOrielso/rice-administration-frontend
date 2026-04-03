"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClientPublic from "@/lib/axiosPublic";

type PaymentStatus = "LOADING" | "PAID" | "FAILED" | "PENDING" | "ERROR";

interface PaymentResponse {
    ok: boolean;
    data: {
        invoiceNumber: string;
        status: string;
        amount?: number;
        customerName?: string;
    };
}

export default function ResultadoContent() {
    const params = useSearchParams();
    const router = useRouter();
    const pollRef = useRef<NodeJS.Timeout | null>(null);

    const invoiceNumber = params.get("invoiceNumber");
    const [status, setStatus] = useState<PaymentStatus>("LOADING");
    const [message, setMessage] = useState("Verificando pago...");
    const [invoiceData, setInvoiceData] = useState<PaymentResponse["data"] | null>(null);

    useEffect(() => {

        const checkInvoice = async () => {
            try {
                if (!invoiceNumber) {
                    setStatus("ERROR");
                    setMessage("No se encontró el número de factura en la URL.");
                    return;
                }

                const { data } = await axiosClientPublic.get<PaymentResponse>(
                    `/payments/${invoiceNumber}`
                );

                const invoice = data.data;
                setInvoiceData(invoice);

                if (invoice.status === "PAID" || invoice.status === "APPROVED") {
                    setStatus("PAID");
                    setMessage("Pago aprobado. Redirigiendo...");
                    if (pollRef.current) clearInterval(pollRef.current);

                    setTimeout(() => {
                        router.push(`/checkout/exito?invoiceNumber=${invoiceNumber}`);
                    }, 2500);

                    return;
                }

                if (invoice.status === "FAILED" || invoice.status === "DECLINED" || invoice.status === "ERROR") {
                    setStatus("FAILED");
                    setMessage("El pago no fue aprobado.");
                    if (pollRef.current) clearInterval(pollRef.current);
                    return;
                }

                setStatus("PENDING");
                setMessage("Tu pago aún se está confirmando...");
            } catch{
                setStatus("ERROR");
                setMessage("Ocurrió un error validando el pago.");
                if (pollRef.current) clearInterval(pollRef.current);
            }
        };

        checkInvoice();

        pollRef.current = setInterval(checkInvoice, 3000);

        const timeout = setTimeout(() => {
            if (pollRef.current) clearInterval(pollRef.current);
        }, 30000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            clearTimeout(timeout);
        };
    }, [invoiceNumber, router]);

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-lg rounded-2xl border p-8 shadow-sm bg-white text-center">
                {status === "LOADING" && <h1 className="text-2xl font-semibold">Verificando pago...</h1>}
                {status === "PENDING" && <h1 className="text-2xl font-semibold">Pago pendiente</h1>}
                {status === "PAID" && <h1 className="text-2xl font-semibold text-green-600">Pago exitoso</h1>}
                {status === "FAILED" && <h1 className="text-2xl font-semibold text-red-600">Pago rechazado</h1>}
                {status === "ERROR" && <h1 className="text-2xl font-semibold text-red-600">Error</h1>}

                <p className="mt-4 text-gray-600">{message}</p>

                {invoiceData?.invoiceNumber && (
                    <p className="mt-3 text-sm text-gray-500">
                        Factura: <span className="font-medium">{invoiceData.invoiceNumber}</span>
                    </p>
                )}

                {status === "FAILED" && (
                    <button
                        onClick={() => router.push("/checkout")}
                        className="mt-6 rounded-xl px-5 py-3 bg-black text-white"
                    >
                        Intentar nuevamente
                    </button>
                )}

                {status === "ERROR" && (
                    <button
                        onClick={() => router.push("/")}
                        className="mt-6 rounded-xl px-5 py-3 bg-black text-white"
                    >
                        Volver al inicio
                    </button>
                )}
            </div>
        </main>
    );
}