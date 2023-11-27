export interface Invoice {
  id?: number | null;
  rentalDate?: string;
  leasingDurationTime?: string;
  totalPrice: number | null;
  moneyPaid?: number | null;
  status: string;
  staffId: number | null;
  customerFootballId?: number | null;
  invoiceDetails?: Array<InvoiceDetail>;
}

export interface InvoiceDetail {
  id?: number;
  price: number;
  amount: number;
  finalCost: number;
  accessoryId: number;
}

export const invoiceStatuses: any = [
  {
    key: "PAID",
    name: "Đã thanh toán",
  },
  {
    key: "DEPOSIT",
    name: "Đã cọc",
  },
  {
    key: "UNPAID",
    name: "Chưa thanh toán",
  },
];

export const useInvoiceStore = defineStore("invoiceStore", () => {
  const { $apis }: any = useNuxtApp();
  const invoices = ref<Invoice[]>([]);
  const invoice = ref<Invoice>();
  const payloadInvoice = ref<Invoice>({
    id: null,
    totalPrice: null,
    moneyPaid: null,
    status: "",
    staffId: null,
    customerFootballId: null,
    invoiceDetails: [],
  });
  const invoiceDetail = ref<any>();

  function createInvoice(payload: Invoice) {
    delete payload.id;
    return $apis.post(`invoices`, {
      ...convertProjectObjToObj(payload),
    });
  }

  function updateInvoice(payload: Invoice) {
    const { id } = payload;
    delete payload.id;
    return $apis.patch(`invoices/${id}`, {
      ...convertProjectObjToObj(payload),
    });
  }

  function deleteInvoice({ id }: { id: number }) {
    return $apis.delete(`invoices/${id}`);
  }

  function deleteInvoiceDetail(id: number) {
    return $apis.delete(`invoices/${id}/detail`);
  }

  async function getInvoices() {
    const invoiceList = await $apis.get(`invoices`);
    invoices.value = invoiceList.data;
  }

  async function getInvoice(id: number) {
    const invoiceSingle = await $apis.get(`invoices/${id}`);
    invoice.value = invoiceSingle.data;
  }

  async function getInvoiceDetail(id: number) {
    const invoiceDetailSingle = await $apis.get(`invoices/${id}/detail`);
    invoiceDetail.value = invoiceDetailSingle.data;
  }

  function getStatusInvoice(status: string | any) {
    let text = "Đã thanh toán";
    let color = "success";

    switch (status) {
      case "DEPOSIT":
        text = "Đã cọc";
        color = "primary";
        break;

      case "UNPAID":
        text = "Chưa thanh toán";
        color = "orange";
        break;
    }
    return { text, color };
  }

  function resetFormInvoice() {
    payloadInvoice.value = {
      id: null,
      totalPrice: null,
      moneyPaid: null,
      status: "",
      staffId: null,
      customerFootballId: null,
      invoiceDetails: [],
    };
  }

  return {
    payloadInvoice,
    invoices,
    invoice,
    invoiceDetail,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    deleteInvoiceDetail,
    getStatusInvoice,
    getInvoices,
    getInvoice,
    getInvoiceDetail,
    resetFormInvoice,
  };
});
