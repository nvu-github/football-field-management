export interface Invoice {
  id?: number | null;
  customerName?: string;
  totalPrice: number | null;
  moneyPaid?: number | null;
  status: string;
  staffId: number | null;
  invoiceTypeId: number | null;
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
  const paramInvoice = ref<Invoice>({
    id: null,
    customerName: "",
    totalPrice: null,
    moneyPaid: null,
    status: "",
    staffId: null,
    invoiceTypeId: null,
    customerFootballId: null,
    invoiceDetails: [],
  });

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
    paramInvoice,
    invoices,
    invoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
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
