"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes, DollarSign } from "lucide-react";
import axiosClient from "@/lib/axios";
import Link from "next/link";

interface InvoicePreview {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface AdminOverviewResponse {
  monthBilling: number;
  totalProducts: number;
  latestInvoices: InvoicePreview[];
}

export default function AdminOverview() {
  const router = useRouter();

  const [overview, setOverview] =
    useState<AdminOverviewResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axiosClient.get("/admin/overview");
        setOverview(res.data.data);
      } catch (error) {
        console.error("Error loading overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <section className="space-y-8">
      {/* HEADER */}
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Panel administrativo
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Resumen general
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Aquí puedes ver el estado actual de tu negocio, ventas e inventario.
          </p>
        </div>

        <div className="flex gap-3">


          <Link
            href="/dashboard/products"
            className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Ver productos
          </Link>
        </div>
      </header>

      {/* METRICAS */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          title="Facturación del mes"
          value={
            loading
              ? "..."
              : formatCurrency(overview?.monthBilling ?? 0)
          }
          note="Ingresos confirmados del mes actual"
          icon={<DollarSign className="h-5 w-5" />}
        />

        <MetricCard
          title="Productos registrados"
          value={
            loading
              ? "..."
              : String(overview?.totalProducts ?? 0)
          }
          note="Total de productos en el sistema"
          icon={<Boxes className="h-5 w-5" />}
        />
      </div>

      {/* ULTIMAS FACTURAS */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            Últimas facturas
          </h2>

          <Link
            href="/dashboard/invoices"
            className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Ver facturas
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {overview?.latestInvoices?.length ? (
            overview.latestInvoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() =>
                  router.push(
                    `/dashboard/invoices/${invoice.invoiceNumber}`
                  )
                }
                className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {invoice.invoiceNumber}
                  </p>

                  <p className="text-sm text-slate-500">
                    {invoice.customerName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    {formatCurrency(invoice.total)}
                  </p>

                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No hay facturas recientes
            </p>
          )}
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid gap-4 xl:grid-cols-3">
        <InfoCard
          title="Administra tu negocio"
          description="Controla productos, facturación y ventas desde un solo lugar."
        />

        <InfoCard
          title="Control de ingresos"
          description="Monitorea tus ingresos mensuales y detecta oportunidades de crecimiento."
        />

        <InfoCard
          title="Gestión de inventario"
          description="Mantén tu stock actualizado y evita quiebres de inventario."
        />
      </div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </h3>

          <p className="mt-2 text-sm text-slate-500">{note}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>
      </div>
    </article>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-emerald-100 text-emerald-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    DECLINED: "bg-red-100 text-red-700",
    ERROR: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${
        map[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}