const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const CUSTOMER_ROLE = 4;

export default defineNuxtRouteMiddleware((to, from) => {
  const userInfo: any = user.value;
  if (userInfo) {
    const { loggedIn, roleId }: any = userInfo;
    if (loggedIn) {
      if (roleId === CUSTOMER_ROLE) {
        return navigateTo("/");
      }
      return navigateTo("/admin");
    }
  }
});
