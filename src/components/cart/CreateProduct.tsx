"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import api from "@/lib/axios";

type ProductFormState = {
  name: string;
  slug: string;
  details: string;
  price: string;
  weightKg: string;
  stock: string;
  minStock: string;
  isActive: boolean;
};

const initialState: ProductFormState = {
  name: "",
  slug: "",
  details: "",
  price: "",
  weightKg: "",
  stock: "",
  minStock: "",
  isActive: true,
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductCreateForm() {
  const [form, setForm] = useState<ProductFormState>(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isFormValid = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.slug.trim() !== "" &&
      form.price.trim() !== "" &&
      form.weightKg.trim() !== "" &&
      form.stock.trim() !== "" &&
      form.minStock.trim() !== ""
    );
  }, [form]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.currentTarget;
    const { name } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    const value = target.value;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "name" && autoSlug) {
        next.slug = makeSlug(value);
      }

      return next;
    });

    if (name === "slug") {
      setAutoSlug(false);
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setImageFile(null);
      setShowPreview("");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Solo se permiten imágenes PNG, JPG o WEBP.");
      e.target.value = "";
      setImageFile(null);
      setShowPreview("");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 3MB.");
      e.target.value = "";
      setImageFile(null);
      setShowPreview("");
      return;
    }

    setImageFile(file);
    setShowPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setForm(initialState);
    setImageFile(null);
    setShowPreview("");
    setAutoSlug(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("El slug es obligatorio");
      return;
    }

    if (!form.price.trim() || Number(form.price) <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    if (!form.weightKg.trim() || Number(form.weightKg) <= 0) {
      toast.error("El peso debe ser mayor a 0");
      return;
    }

    if (Number(form.stock) < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    if (Number(form.minStock) < 0) {
      toast.error("El stock mínimo no puede ser negativo");
      return;
    }

    setIsLoading(true);

    try {
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("slug", form.slug.trim());
      body.append("details", form.details.trim());
      body.append("price", form.price);
      body.append("weightKg", form.weightKg);
      body.append("stock", form.stock);
      body.append("minStock", form.minStock);
      body.append("isActive", String(form.isActive));

      if (imageFile) {
        body.append("image", imageFile);
      }

      const res = await api.post("/products", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data?.message || "Producto creado correctamente");
      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        const fieldErrors = responseData?.errors?.fieldErrors;
        const firstFieldError = fieldErrors
          ? Object.values(fieldErrors).flat().find(Boolean)
          : null;

        const message =
          (typeof firstFieldError === "string" && firstFieldError) ||
          responseData?.message ||
          "No se pudo crear el producto";

        toast.error(message);
        return;
      }

      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
          Inventario
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">
          Crear producto
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra un nuevo producto con precio, peso, stock e imagen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
          >
            Nombre del producto
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Arroz Zulia Premium 50kg"
            className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none transition-all placeholder:text-gray-300 focus:shadow focus:shadow-green-600"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={form.slug}
            onChange={handleChange}
            placeholder="arroz-zulia-premium-50kg"
            className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none transition-all placeholder:text-gray-300 focus:shadow focus:shadow-green-600"
          />
        </div>

        <div>
          <label
            htmlFor="details"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
          >
            Detalles
          </label>
          <textarea
            id="details"
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            placeholder="Descripción corta del producto"
            className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition-all placeholder:text-gray-300 focus:shadow focus:shadow-green-600"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
            >
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="120000"
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none transition-all placeholder:text-gray-300 focus:shadow focus:shadow-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="weightKg"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
            >
              Peso (kg)
            </label>
            <input
              id="weightKg"
              name="weightKg"
              type="number"
              step="0.01"
              min="0"
              value={form.weightKg}
              onChange={handleChange}
              placeholder="50"
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none transition-all placeholder:text-gray-300 focus:shadow focus:shadow-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
            >
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="20"
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none transition-all placeholder:text-gray-300 focus:shadow focus:shadow-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="minStock"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
            >
              Stock mínimo
            </label>
            <input
              id="minStock"
              name="minStock"
              type="number"
              min="0"
              value={form.minStock}
              onChange={handleChange}
              placeholder="5"
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none transition-all placeholder:text-gray-300 focus:shadow focus:shadow-green-600"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
          >
            Imagen del producto
          </label>
          <input
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageChange}
            className="block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 focus:shadow focus:shadow-green-600"
          />
          <p className="mt-2 text-xs text-slate-400">
            PNG, JPG o WEBP. Máximo 3MB.
          </p>
        </div>

        {showPreview && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
              Preview
            </p>
            <Image width={100} height={100}
              src={showPreview}
              alt="Vista previa del producto"
              className="rounded-sm border object-cover aspect-square"
            />
          </div>
        )}

        <label className="flex items-center gap-3 rounded-xl border border-emerald-100 px-4 py-3">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-slate-700">Producto activo</span>
        </label>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="flex cursor-pointer h-13 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-semibold tracking-wide text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 hover:-translate-y-px active:translate-y-0"
          style={{
            background: "linear-gradient(135deg, #166534 0%, #1e7a3e 100%)",
            boxShadow: "0 4px 20px rgba(22,101,52,0.35)",
          }}
        >
          {isLoading ? "Guardando..." : "Crear producto"}
        </button>
      </form>
    </div>
  );
}