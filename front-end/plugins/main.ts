import { useAuthStore, useCustomerStore } from "~/stores";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const customerStore = useCustomerStore();
  authStore.setUserInfoFromLocalStorage();
  customerStore.setFootballPitchRentalFromLocalStorage();
});
