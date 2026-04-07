import { CheckCircle2, Clock3, Receipt } from "lucide-react";

export const documentTypeLabels: Record<string, string> = {
  REGISTRO_CIVIL: "Registro civil",
  TARJETA_EXTRANJERIA: "Tarjeta de extranjería",
  CEDULA_CIUDADANIA: "Cédula de ciudadanía",
  CEDULA_EXTRANJERIA: "Cédula de extranjería",
  NIT: "NIT",
  PASAPORTE: "Pasaporte",
  TARJETA_IDENTIDAD: "Tarjeta de identidad",
  DNI: "DNI",
  CARTEIRA_IDENTIDADE: "Cédula (Brasil)",
  OTRO: "Otro",
};


export function formatCurrency(value: number) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  });
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function getStatusStyles(status: InvoiceStatus) {
  switch (status) {
    case "PAID":
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
    case "PENDING":
      return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
    case "FAILED":
    case "DECLINED":
    case "CANCELLED":
    case "ERROR":
      return "bg-red-100 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}


export function getStatusHeaderStyles(status: InvoiceStatus) {
  switch (status) {
    case "PAID":
    case "APPROVED":
      return "bg-linear-to-r from-green-500 via-green-400 to-green-500 text-white";
    case "PENDING":
      return "bg-linear-to-r from-amber-500 via-amber-400 to-amber-500 text-black";
    case "FAILED":
    case "DECLINED":
    case "CANCELLED":
    case "ERROR":
      return "bg-linear-to-r from-red-500 via-red-400 to-red-500 text-white";
    default:
      return "bg-linear-to-r from-slate-300 via-slate-400 to-slate-300 text-black";
  }
}

export function getStatusLabel(status: InvoiceStatus) {
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

export function getStatusIcon(status: InvoiceStatus) {
  if (status === "PAID" || status === "APPROVED") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (status === "PENDING") {
    return <Clock3 className="h-4 w-4" />;
  }

  return <Receipt className="h-4 w-4" />;
}
