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
  { value: "REGISTRO_CIVIL", label: "Registro civil" },
  { value: "TARJETA_EXTRANJERIA", label: "Tarjeta de extranjería" },
  { value: "CEDULA_CIUDADANIA", label: "Cédula de ciudadanía" },
  { value: "CEDULA_EXTRANJERIA", label: "Cédula de extranjería" },
  { value: "NIT", label: "Número de Identificación Tributaria" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "TARJETA_IDENTIDAD", label: "Tarjeta de identidad" },
  { value: "DNI", label: "Documento Nacional de Identidad" },
  { value: "RG", label: "Carteira de Identidade / Registro Geral" },
  { value: "OTRO", label: "Otro" },
  { value: "RIF", label: "Registro de Información Fiscal" },
  { value: "PPT", label: "Permiso por Protección Temporal" },
] as const;
