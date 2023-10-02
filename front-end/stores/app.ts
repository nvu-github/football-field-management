export interface App {
  title: string | null;
}

type DialogContent = Component | string

export interface Dialog {
  isVisible?: boolean
  isPersistent?: boolean
  data?: { [key: string]: any }
  content: DialogContent
}

export const useAppStore = defineStore("appStore", () => {
  const app = reactive<App>({
    title: "",
  });
  const isShowSidebar = ref<boolean>(false);

  return { app, isShowSidebar };
});
export const useDialogStore = defineStore('dialogStore', () => {
  const defaultDialog = { isVisible: false, isPersistent: false, data: undefined, content: '' }
  const dialog = shallowRef<Dialog>(defaultDialog)

  function showDialog (content: DialogContent, data?: { [key: string]: any }) {
    dialog.value = { isVisible: true, isPersistent: false, content, data }
  }

  function showPersistentDialog (content: DialogContent, data?: { [key: string]: any }) {
    dialog.value = { isVisible: true, isPersistent: true, content, data }
  }

  function closeDialog () {
    dialog.value = defaultDialog
  }

  return { dialog, showDialog, showPersistentDialog, closeDialog }
})