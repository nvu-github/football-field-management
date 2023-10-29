export interface App {
  title: string | null;
}

export interface Menu {
  icon: string;
  title: string;
  url: string;
  subMenu?: SubMenu[];
}

export interface SubMenu {
  icon: string;
  title: string;
  url: string;
}

export interface BreadCrumb {
  title: string | null;
  disabled: boolean | null;
  href: string | null;
}

type DialogContent = Component | string;

export interface Dialog {
  isVisible?: boolean;
  isPersistent?: boolean;
  data?: { [key: string]: any };
  content: DialogContent;
}

export interface ImagePreview {
  id: number;
  file: any;
  url: string;
}

export interface PayLoadPayment {
  amount: number | null;
  pricePayment?: number | null;
}

export const useAppStore = defineStore("appStore", () => {
  const { $apis }: any = useNuxtApp();
  const app = reactive<App>({
    title: "",
  });
  const isShowSidebar = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const breadCrumbs = ref<BreadCrumb[]>([]);

  function uploadImages(formData: FormData) {
    return $apis.post("upload", formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    });
  }

  function uploadImage(formData: FormData) {
    return $apis.post("upload/single", formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    });
  }

  function deleteApi(endpoint: string) {
    return $apis.delete(endpoint);
  }

  return {
    app,
    isShowSidebar,
    isLoading,
    breadCrumbs,
    uploadImages,
    uploadImage,
    deleteApi,
  };
});

export const useDialogStore = defineStore("dialogStore", () => {
  const isDelete = ref<Boolean>(false);
  const defaultDialog = {
    isVisible: false,
    isPersistent: false,
    data: undefined,
    content: "",
  };
  const dialog = shallowRef<Dialog>(defaultDialog);

  function showDialog(content: DialogContent, data?: { [key: string]: any }) {
    dialog.value = { isVisible: true, isPersistent: false, content, data };
  }

  function showPersistentDialog(
    content: DialogContent,
    data?: { [key: string]: any }
  ) {
    dialog.value = { isVisible: true, isPersistent: true, content, data };
  }

  function closeDialog() {
    dialog.value = defaultDialog;
  }

  return { dialog, isDelete, showDialog, showPersistentDialog, closeDialog };
});

export const usePaymentStore = defineStore("paymentStore", () => {
  const { $apis }: any = useNuxtApp();
  const payloadAmountPayment = ref<PayLoadPayment>({
    amount: 0,
    pricePayment: 0,
  });

  function createPaymentUrl(payload: PayLoadPayment) {
    return $apis.post("payment/create-payment-url", {
      ...convertProjectObjToObj(payload),
    });
  }

  function getPaymentResult(query: string) {
    return $apis.get(`payment/vnpay-return?${query}`);
  }

  return { payloadAmountPayment, createPaymentUrl, getPaymentResult };
});
