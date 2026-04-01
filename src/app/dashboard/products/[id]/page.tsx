/* eslint-disable @next/next/no-img-element */
// app/dashboard/products/[id]/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Pencil,
    Package,
    CircleDollarSign,
    Archive,
    Scale,
    BadgeCheck,
    AlertTriangle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Product = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    details?: string | null;
    price: number;
    stock: number;
    minStock: number;
    packageLabel?: string | null;
    unitsPerPackage?: number | null;
    unitWeightGrams?: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = String(params.id);

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadProduct = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
        } catch {
            toast.error("No se pudo cargar el producto");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void loadProduct();
    }, [loadProduct]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
                        Inventario
                    </p>
                    <h1 className="mt-1 text-3xl font-black text-slate-900">
                        Detalle del producto
                    </h1>
                </div>

                <Card className="rounded-3xl border-(--color-brand-soft) bg-white">
                    <CardContent className="p-8">
                        <p className="text-sm text-slate-500">Cargando producto...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="space-y-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
                        Inventario
                    </p>
                    <h1 className="mt-1 text-3xl font-black text-slate-900">
                        Producto no encontrado
                    </h1>
                </div>

                <Card className="rounded-3xl border-(--color-brand-soft) bg-white">
                    <CardContent className="p-8">
                        <p className="text-sm text-slate-500">
                            No se encontró el producto solicitado.
                        </p>

                        <div className="mt-6">
                            <Link href="/dashboard/products">
                                <Button type="button" variant="outline">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Volver al inventario
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isLowStock = product.stock <= product.minStock && product.stock > 0;
    const isOutOfStock = product.stock === 0;
    const imageSrc = product.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL_IMAGES}${product.imageUrl}`
        : null;
    return (
        <div className="space-y-6 p-3">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
                        Inventario
                    </p>
                    <h1 className="mt-1 text-3xl font-black text-slate-900">
                        Detalle del producto
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Consulta toda la información registrada del producto.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link href="/dashboard/products">
                        <Button type="button" variant="outline">
                            <ArrowLeft className="mr-2 size-4" />
                            Volver
                        </Button>
                    </Link>

                    <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Button
                            type="button"
                            className="bg-(--color-brand-orange) text-white hover:bg-(--color-brand-orange-dark)"
                        >
                            <Pencil className="mr-2 size-4" />
                            Editar producto
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="">


                <div className="space-y-6">

                    <Card className="rounded-3xl border-(--color-brand-soft) bg-white">
                        <div className="flex items-center justify-between px-3">
                            <h2 className="text-2xl font-black text-slate-900">
                                {product.name}
                            </h2>

                        </div>
                        <CardContent className="p-3">
                            <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-4">

                                {/* IMAGEN */}
                                <div className="h-full">
                                    <div className="h-full flex rounded-lg border border-(--color-brand-soft) items-center justify-center">
                                        <div className="w-full h-full max-w-30   bg-white">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-slate-400">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Package className="size-12" />
                                                        <span className="text-sm">Sin imagen</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* DETALLES */}
                                <div className="h-full rounded-lg p-3 border border-(--color-brand-soft) bg-white flex flex-col gap-4">
                                    <h3 className="font-bold text-slate-900">Detalles</h3>

                                    <div className="p-2 rounded border border-(--color-brand-soft) flex-1">
                                        <p className="line-clamp-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                                            {product.details?.trim() || "Este producto no tiene detalles registrados."}
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="rounded bg-(--color-brand-green-light) p-2">
                                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--color-brand-green-dark)">
                                                Precio
                                            </p>
                                            <p className="mt-1 font-black text-slate-900">
                                                {formatCurrency(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* INFO */}
                                <div className="h-full rounded-lg p-3 border border-(--color-brand-soft) bg-white flex flex-col gap-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                                        <CircleDollarSign className="size-4" />
                                        <span className="text-sm font-medium">
                                            Información del sistema
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.08em] text-slate-400">
                                            Creado
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {formatDate(product.createdAt)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.08em] text-slate-400">
                                            Última actualización
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {formatDate(product.updatedAt)}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <div className="rounded-2xl border border-(--color-brand-soft) p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                                        <Archive className="size-4" />
                                        <span className="text-sm font-medium">Stock actual</span>
                                    </div>
                                    <p
                                        className={[
                                            "text-2xl font-black",
                                            isOutOfStock
                                                ? "text-red-600"
                                                : isLowStock
                                                    ? "text-(--color-brand-orange-dark)"
                                                    : "text-slate-900",
                                        ].join(" ")}
                                    >
                                        {product.stock}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--color-brand-soft) p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                                        <AlertTriangle className="size-4" />
                                        <span className="text-sm font-medium">Stock mínimo</span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900">
                                        {product.minStock}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--color-brand-soft) p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                                        <BadgeCheck className="size-4" />
                                        <span className="text-sm font-medium">Estado</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.isActive ? (
                                            <Badge className="bg-(--color-brand-green) text-white hover:bg-(--color-brand-green-dark)">
                                                Activo
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactivo</Badge>
                                        )}

                                        {isOutOfStock && (
                                            <Badge variant="destructive">Agotado</Badge>
                                        )}

                                        {!isOutOfStock && isLowStock && (
                                            <Badge className="bg-(--color-brand-orange) text-white hover:bg-(--color-brand-orange-dark)">
                                                Stock bajo
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-(--color-brand-soft) p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                                        <Package className="size-4" />
                                        <span className="text-sm font-medium">Paquete</span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900">
                                        {product.packageLabel || "—"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--color-brand-soft) p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                                        <Archive className="size-4" />
                                        <span className="text-sm font-medium">
                                            Unidades por paquete
                                        </span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900">
                                        {product.unitsPerPackage ?? "—"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--color-brand-soft) p-4">
                                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                                        <Scale className="size-4" />
                                        <span className="text-sm font-medium">
                                            Peso por unidad
                                        </span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900">
                                        {product.unitWeightGrams
                                            ? `${product.unitWeightGrams} g`
                                            : "—"}
                                    </p>
                                </div>


                            </div>
                        </CardContent>
                    </Card>


                </div>
            </div>
        </div>
    );
}