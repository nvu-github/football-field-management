export interface Invoice {
  id?: number;
  customerName?: string;
  totalPrice: number;
  moneyPaid?: number;
  status: string;
  staffId: number;
  invoiceTypeId: number;
  customerFootballId?: number;
}

export interface InvoiceType {
  id?: number;
  name: string;
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

  function createInvoice(payload: Invoice) {
    return $apis.post(`invoices`, {
      ...convertProjectObjToObj(payload),
    });
  }

  async function getInvoices() {
    const invoiceList = await $apis.get(`invoices`);
    invoices.value = invoiceList.data;
  }

  async function getInvoice(id: number) {
    const invoiceSingle = await $apis.get(`invoices/${id}`);
    invoice.value = invoiceSingle.data;
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

  return {
    invoices,
    invoice,
    createInvoice,
    getStatusInvoice,
    getInvoices,
    getInvoice,
  };
});

export const useInvoiceTypeStore = defineStore("invoiceTypeStore", () => {
  const { $apis }: any = useNuxtApp();
  const invoiceTypes = ref<Invoice[]>([]);
  const invoiceType = ref<Invoice>();

  function createInvoiceType(params: InvoiceType) {
    delete params.id;
    return $apis.post("invoices/types", {
      ...convertProjectObjToObj(params),
    });
  }

  function updateInvoiceType(params: InvoiceType) {
    const { id }: any = params;
    delete params.id;
    return $apis.patch(`invoices/types/${id}`, {
      ...convertProjectObjToObj(params),
    });
  }

  function deleteInvoiceType({ id }: { id: string }) {
    return $apis.delete(`invoices/types/${id}`);
  }

  async function getInvoiceTypes() {
    const InvoiceTypeList = await $apis.get("invoices/types");
    invoiceTypes.value = InvoiceTypeList.data;
  }

  async function getInvoiceType(id: number) {
    const InvoiceTypeSingle = await $apis.get(`invoices/types/${id}`);
    invoiceType.value = InvoiceTypeSingle.data;
  }
  return {
    invoiceTypes,
    invoiceType,
    createInvoiceType,
    updateInvoiceType,
    deleteInvoiceType,
    getInvoiceTypes,
    getInvoiceType,
  };
});
