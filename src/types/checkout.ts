
export type DocumentType =
  | "RC"
  | "TE"
  | "CC"
  | "CE"
  | "NIT"
  | "PP"
  | "TI"
  | "DNI"
  | "RG"
  | "OTRO"
  | "RIF"
  | "PPT";

export const documentTypeOptions = [
  { value: "RC", label: "Registro civil" },
  { value: "TE", label: "Tarjeta de extranjería" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "NIT", label: "Número de Identificación Tributaria" },
  { value: "PP", label: "Pasaporte" },
  { value: "TI", label: "Tarjeta de identidad" },
  { value: "DNI", label: "Documento Nacional de Identidad" },
  { value: "RG", label: "Carteira de Identidade / Registro Geral" },
  { value: "OTRO", label: "Otro" },

  // opcionales
  { value: "RIF", label: "RIF" },
  { value: "PPT", label: "Permiso por Protección Temporal (PPT)" },
];
