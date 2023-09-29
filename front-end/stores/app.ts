export interface App {
  title: string | null;
}

export const useAppStore = defineStore("appStore", () => {
  const app = reactive<App>({
    title: "",
  });
  const isShowSidebar = ref<boolean>(false);

  return { app, isShowSidebar };
});

export const useDialogStore = defineStore("dialog", () => {
  const defaultDialog = {
    isVisible: false,
    isPersistent: false,
    data: undefined,
    content: "",
  };
  const dialog = ref<Dialog>(defaultDialog);

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

  return { dialog, showDialog, showPersistentDialog, closeDialog };
});
