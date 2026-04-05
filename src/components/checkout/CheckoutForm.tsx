"use client";

import { CreditCard, Mail, MapPin, Phone, User, Building2, Globe } from "lucide-react";
import { CheckoutFormData, useCartStore } from "@/store/cart-store";
import { CheckoutPayButton } from "./CheckoutButton";
import { toast } from "sonner";
import { documentTypeOptions } from "@/types/checkout";
import { checkoutSchema } from "@/schemas/checkout.schema";

interface CheckoutFormProps {
  form: CheckoutFormData;
  totalPrice: number;
  onBack: () => void;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onSubmit: () => void;
}
export function CheckoutForm({
  onSubmit,
}: CheckoutFormProps) {
  const form = useCartStore((state) => state.checkoutForm);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const setCheckoutField = useCartStore((state) => state.setCheckoutField);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = checkoutSchema.safeParse({
      fullName: form.fullName,
      documentType: form.documentType,
      documentNumber: form.documentNumber,
      address: form.address,
      email: form.email,
      phonePrefix: form.phonePrefix,
      phone: form.phone,
      city: form.city,
      region: form.region,
      country: form.country,
    });

    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Datos inválidos";
      toast.error(firstError);
      return;
    }

    // 👇 aquí ya todo está validado
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
                value={form.fullName}
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
                onChange={(e) =>
                  setCheckoutField(
                    "documentType",
                    e.target.value as typeof documentTypeOptions[number]["value"]
                  )
                }
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
                  value={form.documentNumber}
                  onChange={(e) =>
                    setCheckoutField("documentNumber", e.target.value)
                  }
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
                value={form.address}
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
                value={form.email}
                onChange={(e) => setCheckoutField("email", e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                required
              />
            </div>
          </FieldWrapper>

          <FieldWrapper label="Teléfono">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={form.phonePrefix}
                onChange={(e) => setCheckoutField("phonePrefix", e.target.value)}
                placeholder="+57"
                className="col-span-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600"
                required maxLength={4}
              />
              <div className="relative col-span-2">
                <Phone className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setCheckoutField("phone", e.target.value)}
                  placeholder="3001234567"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                  required
                />
              </div>
            </div>
          </FieldWrapper>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldWrapper label="Ciudad">
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setCheckoutField("city", e.target.value)}
                  placeholder="Bogotá"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper label="Departamento / Región">
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setCheckoutField("region", e.target.value)}
                  placeholder="Cundinamarca"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                  required
                />
              </div>
            </FieldWrapper>
          </div>

          <FieldWrapper label="País">
            <div className="relative">
              <Globe className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.country}
                onChange={(e) => setCheckoutField("country", e.target.value.toUpperCase())}
                placeholder="CO"
                maxLength={2}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
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
        <CheckoutPayButton />
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