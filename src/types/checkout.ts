export type DocumentType =
  | "REGISTRO_CIVIL"
  | "TARJETA_EXTRANJERIA"
  | "CEDULA_CIUDADANIA"
  | "CEDULA_EXTRANJERIA"
  | "NIT"
  | "PASAPORTE"
  | "TARJETA_IDENTIDAD"
  | "DNI"
  | "RG"
  | "OTRO"
  | "RIF"
  | "PPT";

export const documentTypeOptions = [
  { value: "REGISTRO_CIVIL",     label: "Registro Civil" },
  { value: "TARJETA_EXTRANJERIA", label: "Tarjeta de Extranjería" },
  { value: "CEDULA_CIUDADANIA",  label: "Cédula de Ciudadanía" },
  { value: "CEDULA_EXTRANJERIA", label: "Cédula de Extranjería" },
  { value: "NIT",                label: "Número de Identificación Tributaria" },
  { value: "PASAPORTE",          label: "Pasaporte" },
  { value: "TARJETA_IDENTIDAD",  label: "Tarjeta de Identidad" },
  { value: "DNI",                label: "Documento Nacional de Identidad" },
  { value: "CARTEIRA_IDENTIDADE", label: "Carteira de Identidade / Registro Geral" },
  { value: "OTRO",               label: "Otro" },
] as const;


export type InvoiceStatus =
    | "PAID"
    | "APPROVED"
    | "PENDING"
    | "DECLINED"
    | "ERROR"
    | "CANCELLED"
    | "REFUNDED"
    | "EXPIRED";
