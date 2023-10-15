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
  title: string;
  disabled: boolean;
  href: string;
}

type DialogContent = Component | string;

export interface Dialog {
  isVisible?: boolean;
  isPersistent?: boolean;
  data?: { [key: string]: any };
  content: DialogContent;
}

export const useAppStore = defineStore("appStore", () => {
  const { $apis }: any = useNuxtApp();
  const app = reactive<App>({
    title: "",
  });
  const isShowSidebar = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const breadCrumbs = ref<BreadCrumb>();

  function deleteApi(endpoint: string) {
    return $apis.delete(endpoint);
  }

  return { app, isShowSidebar, isLoading, breadCrumbs, deleteApi };
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
