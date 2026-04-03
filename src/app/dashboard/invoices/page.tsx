"use client"
import { InvoicesDataTable } from "@/components/invoices/dataTable";
import { invoiceColums } from "@/components/invoices/columns";
import { getInvoices } from "@/services/getInvoices";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function FacturasPage() {
    const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const stats = {
        total: invoices.length,
        pending: invoices.filter(i => i.status === "PENDING").length,
        paid: invoices.filter(i => ["PAID", "APPROVED"].includes(i.status)).length,
        failed: invoices.filter(i =>
            ["FAILED", "DECLINED", "ERROR"].includes(i.status)
        ).length,
    };

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getInvoices();

                if (!response?.ok || !Array.isArray(response.data)) {
                    throw new Error("Respuesta inválida al cargar facturas");
                }

                setInvoices(response.data);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar las facturas.");
            } finally {
                setLoading(false);
            }
        };

        loadInvoices();
    }, []);

    return (
        <div className="space-y-6 p-3">
            <div>
                <h1 className="text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">Facturas</h1>
                <p className="t-1 text-3xl font-black text-slate-900">
                    Lista de todas las compras registradas
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Total */}
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total facturas</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>

                {/* Pendientes */}
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-500">
                            {stats.pending}
                        </p>
                    </CardContent>
                </Card>

                {/* Pagadas */}
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Pagadas</p>
                        <p className="text-2xl font-bold text-green-600">
                            {stats.paid}
                        </p>
                    </CardContent>
                </Card>

                {/* Fallidas */}
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Fallidas</p>
                        <p className="text-2xl font-bold text-red-500">
                            {stats.failed}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-6">
                    {loading && (
                        <div className="rounded-sm border bg-white p-8 text-sm text-muted-foreground shadow-sm">
                            Cargando facturas...
                        </div>
                    )}

                    {error && (
                        <div className="rounded-sm border border-red-200 bg-red-50 p-8 text-sm text-red-600 shadow-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <InvoicesDataTable columns={invoiceColums} data={invoices} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}