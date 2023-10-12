import { useAuthStore } from "~/stores";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  authStore.setUserToLocalStorage();
});
