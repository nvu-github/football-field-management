const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const CUSTOMER_ROLE = 4;

export default defineNuxtRouteMiddleware((to, from) => {
  // const { loggedIn, roleId }: any = user.value;
  // if (loggedIn) {
  //   if (roleId === CUSTOMER_ROLE) {
  //     return navigateTo("/");
  //   }
  //   return navigateTo("/admin");
  // }
});
