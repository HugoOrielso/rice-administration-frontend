"use client";

import { FormEvent } from "react";
import { CreditCard, Mail, MapPin, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

import { CheckoutFormData } from "@/store/cart-store";

interface CheckoutFormProps {
  form: CheckoutFormData;
  totalPrice: number;
  onBack: () => void;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onSubmit: () => void;
}

const documentTypeOptions = [
  { value: "CEDULA_CIUDADANIA", label: "CC" },
  { value: "NIT", label: "NIT" },
  { value: "CEDULA_EXTRANJERIA", label: "CE" },
  { value: "PPT", label: "PPT" },
  { value: "RIF", label: "RIF" },
] as const;

export function CheckoutForm({
  form,
  totalPrice,
  onBack,
  onChange,
  onSubmit,
}: CheckoutFormProps) {
  const setCheckoutField = useCartStore((state) => state.setCheckoutField);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullName = form.fullName.trim();
    const documentNumber = form.documentNumber.trim();
    const address = form.address.trim();
    const email = form.email.trim();

    if (!fullName) {
      alert("Debes ingresar tu nombre completo");
      return;
    }

    if (!form.documentType) {
      alert("Debes seleccionar el tipo de documento");
      return;
    }

    if (!documentNumber) {
      alert("Debes ingresar el número de documento");
      return;
    }

    if (!address) {
      alert("Debes ingresar la dirección");
      return;
    }

    if (!email) {
      alert("Debes ingresar el correo");
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-5">
          <FieldWrapper label="Nombre completo">
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.fullName ?? ''}
                onChange={(e) => setCheckoutField("fullName", e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                required
              />
            </div>
          </FieldWrapper>

          <FieldWrapper label="Documento">
            <div className="grid grid-cols-3 gap-2">
              <select
                value={form.documentType}
                onChange={(e) => setCheckoutField("documentType", e.target.value)}
                className="col-span-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600"
                required
              >
                {documentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="relative col-span-2">
                <CreditCard className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.documentNumber ?? ''}
                  onChange={(e) => setCheckoutField("documentNumber", e.target.value)}
                  placeholder="Número de documento"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                  required
                />
              </div>
            </div>
          </FieldWrapper>

          <FieldWrapper label="Dirección">
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.address ?? ''}
                onChange={(e) => setCheckoutField("address", e.target.value)}
                placeholder="Dirección de facturación"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                required
              />
            </div>
          </FieldWrapper>

          <FieldWrapper label="Correo para factura">
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email ?? ''}
                onChange={(e) => setCheckoutField("email", e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                required
              />
            </div>
          </FieldWrapper>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm text-slate-600">Total a pagar</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              ${totalPrice.toLocaleString("es-CO")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-5">
        <button
          type="submit"
          className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          Continuar al pago
        </button>
      </div>
    </form>
  );
}
function FieldWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}