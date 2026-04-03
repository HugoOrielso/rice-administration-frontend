"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axiosClient from "@/lib/axios";
import { CheckCircle2, Clock3, CreditCard, Receipt, User } from "lucide-react";

type InvoiceStatus = "PENDING" | "PAID" | "APPROVED" | "FAILED" | "DECLINED" | "ERROR";


function formatCurrency(value: number) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function getStatusStyles(status: InvoiceStatus) {
  switch (status) {
    case "PAID":
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "FAILED":
    case "DECLINED":
    case "ERROR":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
  }
}

function getStatusLabel(status: InvoiceStatus) {
  switch (status) {
    case "PAID":
      return "Pagada";
    case "APPROVED":
      return "Aprobada";
    case "PENDING":
      return "Pendiente";
    case "FAILED":
      return "Fallida";
    case "DECLINED":
      return "Declinada";
    case "ERROR":
      return "Error";
    default:
      return status;
  }
}

function getStatusIcon(status: InvoiceStatus) {
  if (status === "PAID" || status === "APPROVED") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (status === "PENDING") {
    return <Clock3 className="h-4 w-4" />;
  }

  return <Receipt className="h-4 w-4" />;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceNumber = params.invoiceNumber as string;

  const [invoice, setInvoice] = useState<InvoiceResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosClient.get(`/invoices/${invoiceNumber}`);
        setInvoice(res.data.data);
      } catch{
        setError("No se pudo cargar la factura.");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceNumber) {
      fetchInvoice();
    }
  }, [invoiceNumber]);

  const totalItems = useMemo(() => {
    if (!invoice) return 0;
    return invoice.items.reduce((acc, item) => acc + item.quantity, 0);
  }, [invoice]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-36 rounded-3xl bg-white shadow-sm" />
          <div className="h-80 rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] bg-slate-50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 text-red-600 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-[50vh] bg-slate-50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 text-slate-700 shadow-sm">
          Factura no encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-200 bg-linear-to-r from-green-900 via-green-800 to-green-900 px-6 py-8 text-white md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                  Comprobante de compra
                </p>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Factura
                  </h1>
                  <p className="mt-2 text-lg text-slate-200">{invoice.invoiceNumber}</p>
                </div>

                <p className="text-sm text-slate-300">
                  Emitida el {formatDate(invoice.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyles(
                    invoice.status
                  )}`}
                >
                  {getStatusIcon(invoice.status)}
                  {getStatusLabel(invoice.status)}
                </span>

                <div className="text-sm text-slate-200">
                  <p>
                    <span className="text-slate-400">Actualizada:</span>{" "}
                    {formatDate(invoice.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-2 md:px-10 md:py-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-slate-600" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Datos del cliente
                </h2>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <p className="text-lg font-semibold text-slate-900">{invoice.customerName}</p>
                <p>{invoice.customerEmail}</p>
                <p>{invoice.customerPhone}</p>
                <p>{invoice.customerAddress}</p>
                <div className="pt-2 text-slate-600">
                  <span className="font-semibold text-slate-800">Documento:</span>{" "}
                  {invoice.documentType} - {invoice.documentNumber}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-slate-600" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Información de pago
                </h2>
              </div>

              <div className="grid gap-3 text-sm text-slate-700">
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Estado interno</span>
                  <span className="font-semibold text-slate-900">{invoice.status}</span>
                </div>

                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Estado Wompi</span>
                  <span className="font-semibold text-slate-900">
                    {invoice.wompiStatus || "-"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Método de pago</span>
                  <span className="font-semibold text-slate-900">
                    {invoice.paymentMethodType || "-"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500">Transacción</span>
                  <span className="max-w-55 break-all text-right font-semibold text-slate-900">
                    {invoice.wompiTransactionId || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Detalle de productos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {invoice.items.length} producto(s) · {totalItems} unidad(es)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto px-0 md:px-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-4 font-semibold text-slate-700">Producto</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Cantidad</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Precio unitario</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Total</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index !== invoice.items.length - 1 ? "border-b border-slate-100" : ""}
                  >
                    <td className="px-6 py-5 align-top">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{item.productName}</p>

                        {item.packageLabel && (
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Presentación: {item.packageLabel}
                          </p>
                        )}

                        {(item.unitsPerPackage || item.unitWeightGrams) && (
                          <p className="text-xs text-slate-500">
                            {item.unitsPerPackage ? `${item.unitsPerPackage} und/paq` : ""}
                            {item.unitsPerPackage && item.unitWeightGrams ? " · " : ""}
                            {item.unitWeightGrams ? `${item.unitWeightGrams} g` : ""}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 align-top font-medium text-slate-800">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-5 align-top font-medium text-slate-800">
                      {formatCurrency(item.unitPrice)}
                    </td>

                    <td className="px-6 py-5 text-right align-top font-semibold text-slate-900">
                      {formatCurrency(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-6 border-t border-slate-200 px-6 py-6 md:grid-cols-[1fr_340px] md:px-10">
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Resumen</p>
              <p className="mt-2">
                Esta factura corresponde al pedido <strong>{invoice.invoiceNumber}</strong>.
              </p>
              <p className="mt-1">
                Conserva este comprobante como soporte del pago y detalle de compra.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-3 text-lg font-bold text-slate-950">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}