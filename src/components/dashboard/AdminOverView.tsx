"use client";

import {
    Archive,
    ArrowUpRight,
    Boxes,
    DollarSign,
    Package2,
} from "lucide-react";

interface InvoiceItem {
    id: string;
    customer: string;
    amount: number;
    status: "Pagada" | "Pendiente" | "Vencida";
    date: string;
}

interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    stock: number;
    minStock: number;
}

const recentInvoices: InvoiceItem[] = [
    {
        id: "FAC-001",
        customer: "Distribuidora Central",
        amount: 850000,
        status: "Pagada",
        date: "30 Mar 2026",
    },
    {
        id: "FAC-002",
        customer: "Comercializadora Andina",
        amount: 420000,
        status: "Pendiente",
        date: "29 Mar 2026",
    },
    {
        id: "FAC-003",
        customer: "Mercados del Norte",
        amount: 310000,
        status: "Vencida",
        date: "28 Mar 2026",
    },
];

const lowStockProducts: InventoryItem[] = [
    {
        id: "1",
        name: "Arroz Zulia 500g",
        sku: "AZ-500",
        stock: 8,
        minStock: 15,
    },
    {
        id: "2",
        name: "Arroz Zulia 1kg",
        sku: "AZ-1000",
        stock: 12,
        minStock: 20,
    },
    {
        id: "3",
        name: "Arroz Zulia Premium 5kg",
        sku: "AZ-5000",
        stock: 4,
        minStock: 10,
    },
];

export default function AdminOverview() {
    return (
        <section className="space-y-8">
            <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Panel administrativo
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                        Resumen general
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                        Un vistazo rápido al estado de las facturas y del inventario para
                        empezar a gestionar el negocio.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                        Ver facturas
                    </button>
                    <button className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                        Ver inventario
                    </button>
                </div>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 ">
                <MetricCard
                    title="Facturación del mes"
                    value="$2.480.000"
                    note="+12.5% vs mes anterior"
                    icon={<DollarSign className="h-5 w-5" />}
                />
                <MetricCard
                    title="Productos en inventario"
                    value="126"
                    note="7 con stock bajo"
                    icon={<Boxes className="h-5 w-5" />}
                />
            </div>

            <div className="flex flex-col gap-6">


                <div className="grid xl:grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">
                                    Resumen inventario
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Estado general del stock
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <Archive className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <MiniStat
                                label="Stock total disponible"
                                value="2.845 unidades"
                            />
                            <MiniStat
                                label="Productos con stock bajo"
                                value="7 referencias"
                                danger
                            />
                            <MiniStat
                                label="Última actualización"
                                value="Hoy, 8:30 AM"
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                <Package2 className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">
                                    Stock bajo
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Productos que necesitan reposición
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {lowStockProducts.map((product) => {
                                const isCritical = product.stock <= product.minStock / 2;

                                return (
                                    <div
                                        key={product.id}
                                        className="rounded-2xl border border-slate-200 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    SKU: {product.sku}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${isCritical
                                                        ? "bg-red-50 text-red-600"
                                                        : "bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                {isCritical ? "Crítico" : "Bajo"}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                                                <span>Stock actual: {product.stock}</span>
                                                <span>Mínimo: {product.minStock}</span>
                                            </div>

                                            <div className="h-2 rounded-full bg-slate-100">
                                                <div
                                                    className={`h-2 rounded-full ${isCritical ? "bg-red-500" : "bg-amber-500"
                                                        }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            (product.stock / product.minStock) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">
                                Facturas recientes
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Últimos movimientos registrados
                            </p>
                        </div>

                        <button className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                            Ver todas
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <div className="hidden grid-cols-4 gap-4 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
                            <span>Factura</span>
                            <span>Cliente</span>
                            <span>Monto</span>
                            <span>Estado</span>
                        </div>

                        <div className="divide-y divide-slate-200">
                            {recentInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="grid gap-3 px-4 py-4 md:grid-cols-4 md:items-center"
                                >
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {invoice.id}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">{invoice.date}</p>
                                    </div>

                                    <p className="text-sm text-slate-700">{invoice.customer}</p>

                                    <p className="text-sm font-semibold text-slate-900">
                                        ${invoice.amount.toLocaleString("es-CO")}
                                    </p>

                                    <div>
                                        <StatusBadge status={invoice.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
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

function MiniStat({
    label,
    value,
    danger = false,
}: {
    label: string;
    value: string;
    danger?: boolean;
}) {
    return (
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <p
                className={`mt-1 text-lg font-extrabold ${danger ? "text-red-600" : "text-slate-900"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: "Pagada" | "Pendiente" | "Vencida";
}) {
    const styles = {
        Pagada: "bg-emerald-50 text-emerald-700",
        Pendiente: "bg-amber-50 text-amber-700",
        Vencida: "bg-red-50 text-red-600",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
        >
            {status}
        </span>
    );
}