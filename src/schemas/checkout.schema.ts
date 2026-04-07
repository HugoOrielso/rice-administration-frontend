import { z } from "zod";

export const documentTypeValues = [
  "REGISTRO_CIVIL",
  "TARJETA_EXTRANJERIA",
  "CEDULA_CIUDADANIA",
  "CEDULA_EXTRANJERIA",
  "NIT",
  "PASAPORTE",
  "TARJETA_IDENTIDAD",
  "DNI",
  "CARTEIRA_IDENTIDADE",
  "OTRO",
] as const;

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Debes ingresar tu nombre completo"),

  documentType: z.enum(documentTypeValues, {
    message: "Debes seleccionar el tipo de documento",
  }),

  documentNumber: z
    .string()
    .trim()
    .min(1, "Debes ingresar el número de documento"),

  address: z
    .string()
    .trim()
    .min(1, "Debes ingresar la dirección"),

  email: z
    .string()
    .trim()
    .min(1, "Debes ingresar el correo")
    .email("Debes ingresar un correo válido"),

  phonePrefix: z
    .string()
    .trim()
    .min(1, "Debes ingresar el prefijo")
    .max(5, "Prefijo inválido")
    .regex(/^\+?[0-9]+$/, "Solo números y opcional +"),

  phone: z
    .string()
    .trim()
    .min(1, "Debes ingresar el teléfono"),

  city: z
    .string()
    .trim()
    .min(1, "Debes ingresar la ciudad"),

  department: z
    .string()
    .trim()
    .min(1, "Debes ingresar el departamento o región"),

  country: z
    .string()
    .trim()
    .min(1, "Debes ingresar el país"),  // ← se quitó .length(2) porque ya no es código ISO
});

export type CheckoutFormSchema = z.infer<typeof checkoutSchema>;
export type DocumentType = z.infer<typeof checkoutSchema.shape.documentType>;