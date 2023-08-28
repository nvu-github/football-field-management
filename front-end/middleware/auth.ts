const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

export default defineNuxtRouteMiddleware((to, from) => {
  // const { loggedIn } = user.value;
  // if (loggedIn && from.name === "auth-types") {
  //   return navigateTo("/");
  // }
});
