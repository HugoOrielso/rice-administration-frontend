"use client";

import { FormEvent } from "react";
import { ArrowLeft, CreditCard, MapPin, Mail, User } from "lucide-react";
import { CheckoutFormData } from "@/store/cart-store";

interface CheckoutFormProps {
  form: CheckoutFormData;
  totalPrice: number;
  onBack: () => void;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onSubmit: () => void;
}

export function CheckoutForm({
  form,
  totalPrice,
  onBack,
  onChange,
  onSubmit,
}: CheckoutFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Checkout</h2>
          <p className="text-sm text-slate-500">
            Completa tus datos para continuar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <FieldWrapper label="Nombre completo">
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper label="Cédula">
              <div className="relative">
                <CreditCard className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.cc}
                  onChange={(e) => onChange("cc", e.target.value)}
                  placeholder="Número de cédula"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper label="Dirección">
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
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
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
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
    </div>
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