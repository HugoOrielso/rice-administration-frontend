type InvoiceStatus = "PENDING" | "PAID" | "APPROVED" | "FAILED" | "DECLINED" | "ERROR" | "CANCELLED";

interface InvoiceItemResponse {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  packageLabel?: string | null;
  unitsPerPackage?: number | null;
  unitWeightGrams?: string | number | null;
}

interface InvoiceResponseData {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCountry: string;
  customerCity: string;
  customerDepartment: string;
  documentType: string;
  documentNumber: string;
  subtotal: number;
  total: number;
  status: InvoiceStatus;
  wompiTransactionId?: string | null;
  wompiStatus?: string | null;
  paymentMethodType?: string | null;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItemResponse[];
}

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
}

interface InvoiceApiResponse {
  ok: boolean;
  data: InvoiceResponseData;
}

interface GetAllInvoicesResponse {
  ok: boolean;
  data: InvoiceRow[];
}