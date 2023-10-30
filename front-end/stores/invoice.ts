export interface Invoice {
  totalPrice: number;
  moneyPaid: number;
  status: string;
  staffId: number;
  invoiceTypeId: number;
  customerFootballId: number;
}

export const useInvoiceStore = defineStore("invoiceStore", () => {
  const { $apis }: any = useNuxtApp();

  function createInvoice(payload: Invoice) {
    return $apis.post(`invoices`, {
      ...convertProjectObjToObj(payload),
    });
  }
  return { createInvoice };
});
