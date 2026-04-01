// app/dashboard/products/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { ProductActions } from "./productsActions";

function formatCurrency(value: string | number) {
    const amount = Number(value ?? 0);
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatWeightGrams(value?: string | number | null) {
    if (value === null || value === undefined || value === "") return "—";
    return `${Number(value)} g`;
}

export function getProductColumns(
    onRefresh: () => void
): ColumnDef<Product>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0 hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Producto
                        <ArrowUpDown className="ml-2 size-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const product = row.original;

                return (
                    <div className="min-w-55">
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.slug}</p>
                    </div>
                );
            },
        },
        {
            accessorKey: "price",
            header: "Precio",
            cell: ({ row }) => (
                <span className="font-medium">
                    {formatCurrency(row.original.price)}
                </span>
            ),
        },
        {
            accessorKey: "stock",
            header: "Stock",
            cell: ({ row }) => {
                const { stock, minStock } = row.original;

                if (stock === 0) {
                    return (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-red-600">0</span>
                            <Badge variant="destructive">Agotado</Badge>
                        </div>
                    );
                }

                if (stock <= minStock) {
                    return (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-amber-600">{stock}</span>
                            <Badge className="bg-amber-500 hover:bg-amber-500">Bajo</Badge>
                        </div>
                    );
                }

                return <span>{stock}</span>;
            },
        },
        {
            accessorKey: "packageLabel",
            header: "Paquete",
            cell: ({ row }) => row.original.packageLabel || "—",
        },
        {
            accessorKey: "unitsPerPackage",
            header: "Unidades",
            cell: ({ row }) => row.original.unitsPerPackage ?? "—",
        },
        {
            accessorKey: "unitWeightGrams",
            header: "Peso/unidad",
            cell: ({ row }) => formatWeightGrams(row.original.unitWeightGrams),
        },
        {
            accessorKey: "isActive",
            header: "Estado",
            cell: ({ row }) =>
                row.original.isActive ? (
                    <Badge className="bg-(--color-brand-green) text-white hover:bg-(--color-brand-green-dark)">
                        Activo
                    </Badge>
                ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <ProductActions product={row.original} onRefresh={onRefresh} />
            ),
        },
    ];
}