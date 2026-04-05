"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Package, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { getProductColumns } from "@/components/inventory/columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/inventory/tableProducts";
import axiosClient from "@/lib/axios";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get("/products");
      setProducts(res.data);
    } catch  {
      toast.error("No se pudieron cargar los productos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const columns = useMemo(() => getProductColumns(loadProducts), [loadProducts]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="space-y-6 p-3">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
            Inventario
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Gestión de productos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Consulta stock, precios y estado de tus productos.
          </p>
        </div>

        <Button className="bg-(--color-brand-orange) hover:bg-(--color-brand-orange-dark) text-white" >
          <Link href="/dashboard/products/create" className="flex items-center gap-2">
            <PackagePlus className="mr-2 size-4" />
            Crear producto
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-emerald-50 p-3">
              <Package className="size-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total productos</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalProducts}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Activos</p>
            <p className="text-2xl font-bold text-slate-900">
              {activeProducts}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Stock bajo</p>
            <p className="text-2xl font-bold text-red-600">
              {lowStockProducts}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Cargando productos...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={products}
              filterColumn="name"
              filterPlaceholder="Buscar por nombre..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}