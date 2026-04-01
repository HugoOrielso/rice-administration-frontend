/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import { axiosClient } from "@/lib/axios";

export type ProductFormValues = {
  name: string;
  slug: string;
  details: string;
  price: string;
  stock: string;
  minStock: string;
  packageLabel: string;
  unitsPerPackage: string;
  unitWeightGrams: string;
  isActive: boolean;
  imageUrl?: string;
};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
  onSuccess?: () => void;
};

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  details: "",
  price: "",
  stock: "",
  minStock: "",
  packageLabel: "",
  unitsPerPackage: "",
  unitWeightGrams: "",
  isActive: true,
  imageUrl: "",
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

export default function ProductForm({
  mode,
  productId,
  defaultValues,
  onSuccess,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>({
    ...emptyValues,
    ...defaultValues,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!defaultValues) return;

    setForm({
      ...emptyValues,
      ...defaultValues,
    });

    if (defaultValues.imageUrl) {
      const fullImageUrl = defaultValues.imageUrl.startsWith("http")
        ? defaultValues.imageUrl
        : `${process.env.NEXT_PUBLIC_API_URL_IMAGES}${defaultValues.imageUrl}`;
      setPreviewImage(fullImageUrl);
    } else {
      setPreviewImage("");
    }
  }, [defaultValues]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const isFormValid = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.slug.trim() !== "" &&
      form.price.trim() !== "" &&
      Number(form.price) > 0 &&
      form.stock.trim() !== "" &&
      Number(form.stock) >= 0 &&
      form.minStock.trim() !== "" &&
      Number(form.minStock) >= 0
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

      if (!isEdit && name === "name") {
        next.slug = makeSlug(value);
      }

      return next;
    });
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (!file) {
      setImageFile(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Solo se permiten imágenes PNG, JPG o WEBP.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 3MB.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    setImageFile(file);
    setPreviewImage(objectUrl);
  }

  function resetCreateForm() {
    setForm(emptyValues);
    setImageFile(null);
    setPreviewImage("");

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

    if (!form.stock.trim() || Number(form.stock) < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    if (!form.minStock.trim() || Number(form.minStock) < 0) {
      toast.error("El stock mínimo no puede ser negativo");
      return;
    }

    if (form.unitsPerPackage.trim() && Number(form.unitsPerPackage) <= 0) {
      toast.error("Las unidades por paquete deben ser mayores a 0");
      return;
    }

    if (form.unitWeightGrams.trim() && Number(form.unitWeightGrams) <= 0) {
      toast.error("El peso por unidad debe ser mayor a 0");
      return;
    }

    setIsLoading(true);

    try {
      const body = new FormData();

      body.append("name", form.name.trim());
      body.append("slug", form.slug.trim());
      body.append("price", form.price);
      body.append("stock", form.stock);
      body.append("minStock", form.minStock);
      body.append("isActive", String(form.isActive));

      if (form.details.trim()) {
        body.append("details", form.details.trim());
      }

      if (form.packageLabel.trim()) {
        body.append("packageLabel", form.packageLabel.trim());
      }

      if (form.unitsPerPackage.trim()) {
        body.append("unitsPerPackage", form.unitsPerPackage);
      }

      if (form.unitWeightGrams.trim()) {
        body.append("unitWeightGrams", form.unitWeightGrams);
      }

      if (imageFile) {
        body.append("image", imageFile);
      }

      if (isEdit) {
        const res = await axiosClient.patch(`/products/${productId}`, body);

        toast.success(res.data?.message || "Producto actualizado correctamente");
      } else {
        const res = await axiosClient.post("/products", body);

        toast.success(res.data?.message || "Producto creado correctamente");
        resetCreateForm();
      }

      onSuccess?.();
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
          `No se pudo ${isEdit ? "actualizar" : "crear"} el producto`;

        toast.error(message);
        return;
      }

      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div >
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
          Inventario
        </p>

        <h2 className="mt-1 text-3xl font-black text-slate-900">
          {isEdit ? "Editar producto" : "Crear producto"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isEdit
            ? "Actualiza la información del producto, su stock, presentación e imagen."
            : "Registra un nuevo producto con precio, stock, presentación e imagen."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 border rounded-sm p-3">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)"
          >
            Nombre del producto
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Arroz Zulia Bulto 24x500g"
            className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)"
          >
            Slug {isEdit ? "" : "(autogenerado)"}
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={form.slug}
            readOnly
            className="h-13 w-full cursor-not-allowed rounded-xl border bg-gray-100 px-4 text-sm text-gray-500 outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="details"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)"
          >
            Detalles
          </label>
          <textarea
            id="details"
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            placeholder="Ej: Bulto con 24 bolsas..."
            className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none"
            />
          </div>

          <div>
            <label htmlFor="stock" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none"
            />
          </div>

          <div>
            <label htmlFor="minStock" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
              Stock mínimo
            </label>
            <input
              id="minStock"
              name="minStock"
              type="number"
              min="0"
              value={form.minStock}
              onChange={handleChange}
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none"
            />
          </div>

          <div>
            <label htmlFor="packageLabel" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
              Tipo de paquete
            </label>
            <input
              id="packageLabel"
              name="packageLabel"
              type="text"
              value={form.packageLabel}
              onChange={handleChange}
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none"
            />
          </div>

          <div>
            <label htmlFor="unitsPerPackage" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
              Unidades por paquete
            </label>
            <input
              id="unitsPerPackage"
              name="unitsPerPackage"
              type="number"
              min="0"
              value={form.unitsPerPackage}
              onChange={handleChange}
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none"
            />
          </div>

          <div>
            <label htmlFor="unitWeightGrams" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
              Peso por unidad (gramos)
            </label>
            <input
              id="unitWeightGrams"
              name="unitWeightGrams"
              type="number"
              min="0"
              value={form.unitWeightGrams}
              onChange={handleChange}
              className="h-13 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)"
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
            className="block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700"
          />
        </div>

        {previewImage && (
          <div className="rounded-2xl border border-(--color-brand-soft) bg-(--color-brand-cream) p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-brand-green)">
              Preview
            </p>
            <img
              src={previewImage}
              alt="Vista previa del producto"
              className="aspect-square h-30 w-30 rounded-sm border object-contain "
            />
          </div>
        )}

        <label className="flex items-center gap-3 rounded-xl border border-(--color-brand-soft) px-4 py-3">
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
          className="flex h-13 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-semibold tracking-wide text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          style={{
            background: isEdit
              ? "linear-gradient(135deg, #D76924 0%, #b95517 100%)"
              : "linear-gradient(135deg, #166534 0%, #1e7a3e 100%)",
          }}
        >
          {isLoading
            ? "Guardando..."
            : isEdit
            ? "Guardar cambios"
            : "Crear producto"}
        </button>
      </form>
    </div>
  );
}