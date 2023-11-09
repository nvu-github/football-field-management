import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores";
const CUSTOMER_ROLE = 4;

export default defineNuxtRouteMiddleware((to, from) => {
  const app: any = useNuxtApp();
  const authStore = useAuthStore(app.$pinia);
  const { user } = storeToRefs(authStore);
  const userInfo: any = user.value;
  const { loggedIn, roleId }: any = userInfo || {
    loggedIn: false,
    roleId: null,
  };
  if (to.path.includes("admin")) {
    if (!loggedIn) {
      return navigateTo("/auth/login");
    }
    if (loggedIn && roleId === CUSTOMER_ROLE) {
      return navigateTo("/");
    }
  } else {
    const includedEndpointLogin = [
      "football-pitches-rental",
      "football-pitches-histories",
      "football-pitches-thanks",
    ];
    const { name }: any = to;

    if (loggedIn && roleId !== CUSTOMER_ROLE) {
      return navigateTo("/admin");
    }

    if (includedEndpointLogin.includes(name)) {
      if (!loggedIn) return navigateTo("/auth/login");
      if (loggedIn && roleId !== CUSTOMER_ROLE) return navigateTo("/admin");
    }
  }
});
