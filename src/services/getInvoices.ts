import axiosClient from "@/lib/axios";

export async function getInvoices() {
  const { data } = await axiosClient.get<GetAllInvoicesResponse>("/invoices");
  return data;
}