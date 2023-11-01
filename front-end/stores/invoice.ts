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

  function getStatusInvoice(status: string | any) {
    let text = 'Đã thanh toán';
    let color = 'success';

    switch (status) {
      case 'DEPOSIT':
        text = 'Đã cọc';
        color = 'primary'
        break;

      case 'UNPAID':
        text = 'Chưa thanh toán';
        color = 'orange'
        break;
    }
    return { text, color }
  }

  return { createInvoice, getStatusInvoice };
});
