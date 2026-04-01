// app/dashboard/products/_components/product-actions.tsx
"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Eye, Ban } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Props = {
  product: Product;
  onRefresh?: () => void;
};

export function ProductActions({ product, onRefresh }: Props) {
  async function handleDeactivate() {
    try {
      await api.patch(`/products/${product.id}/deactivate`);
      toast.success("Producto desactivado");
      onRefresh?.();
    } catch {
      toast.error("No se pudo desactivar el producto");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/products/${product.id}`}>
            <Eye className="mr-2 size-4" />
            Ver detalle
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/dashboard/products/${product.id}/edit`}>
            <Pencil className="mr-2 size-4" />
            Editar
          </Link>
        </DropdownMenuItem>

        {product.isActive && (
          <DropdownMenuItem onClick={handleDeactivate}>
            <Ban className="mr-2 size-4" />
            Desactivar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}