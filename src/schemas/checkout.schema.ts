import { z } from "zod";

export const documentTypeValues = [
    "RC",
    "TE",
    "CC",
    "CE",
    "NIT",
    "PP",
    "TI",
    "DNI",
    "RG",
    "OTRO",
    "RIF",
    "PPT",
] as const;


export const checkoutSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Debes ingresar tu nombre completo"),

    documentType: z.enum(documentTypeValues, {
        message: "Debes seleccionar el tipo de documento"
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
        .max(5, "Prefijo inválido") // +XXXX
        .regex(/^\+?[0-9]+$/, "Solo números y opcional +"),

    phone: z
        .string()
        .trim()
        .min(1, "Debes ingresar el teléfono"),

    city: z
        .string()
        .trim()
        .min(1, "Debes ingresar la ciudad"),

    region: z
        .string()
        .trim()
        .min(1, "Debes ingresar el departamento o región"),

    country: z
        .string()
        .trim()
        .min(1, "Debes ingresar el país")
        .length(2, "El país debe tener 2 caracteres"),
});

export type CheckoutFormSchema = z.infer<typeof checkoutSchema>;
export type DocumentType = z.infer<typeof checkoutSchema.shape.documentType>;