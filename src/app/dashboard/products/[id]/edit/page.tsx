"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductForm, { ProductFormValues } from "@/components/inventory/ProductForm";
import { axiosClient } from "@/lib/axios";

type ProductApiResponse = {
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
};

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = String(params.id);

    const [product, setProduct] = useState<ProductFormValues | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadProduct = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get<ProductApiResponse>(`/products/${id}`);
            const data = res.data;

            setProduct({
                name: data.name ?? "",
                slug: data.slug ?? "",
                details: data.details ?? "",
                price: String(data.price ?? ""),
                stock: String(data.stock ?? ""),
                minStock: String(data.minStock ?? ""),
                packageLabel: data.packageLabel ?? "",
                unitsPerPackage:
                    data.unitsPerPackage !== null && data.unitsPerPackage !== undefined
                        ? String(data.unitsPerPackage)
                        : "",
                unitWeightGrams:
                    data.unitWeightGrams !== null && data.unitWeightGrams !== undefined
                        ? String(data.unitWeightGrams)
                        : "",
                isActive: Boolean(data.isActive),
                imageUrl: data.imageUrl ?? "",
            });
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
        return <div className="flex h-full w-full"><p className="text-2xl">Cargando producto...</p></div>;
    }

    if (!product) {
        return <div className="flex h-full w-full"><p className="text-2xl">No se encontró el producto.</p></div>;
    }

    return (
        <div className="p-3">
            <ProductForm
                mode="edit"
                productId={id}
                defaultValues={product}
                onSuccess={() => router.push(`/dashboard/products/${id}`)}
            />
        </div>
    );
}