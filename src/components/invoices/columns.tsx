"use client";

import { ColumnDef } from "@tanstack/react-table";

function getStatusStyles(status: InvoiceStatus) {
  switch (status) {
    case "PAID":
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "FAILED":
    case "DECLINED":
    case "ERROR":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export const invoiceColums: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Factura",
  },
  {
    accessorKey: "customerName",
    header: "Cliente",
  },
  {
    accessorKey: "customerEmail",
    header: "Correo",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const value = row.original.total;
      return `$${value.toLocaleString("es-CO")}`;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
            status
          )}`}
        >
          {status}
        </span>
      );
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString("es-CO");
    },
  },
];