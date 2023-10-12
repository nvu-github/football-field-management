export interface User {
  name: string | null;
  email: string | null;
  loggedIn: boolean;
}

export interface Login {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("authStore", () => {
  const { $apis }: any = useNuxtApp();
  const user = ref<User>();

  function signIn(params: Login) {
    return $apis.post("auth/signin", {
      ...params,
    });
  }

  function signInGoogle() {
    return $apis.get("auth/google");
  }

  function setUserToLocalStorage() {
    const userLoggedIn = localStorage.getItem("userLogin");
    if (userLoggedIn) {
      user.value = JSON.parse(userLoggedIn);
    }
  }

  return { user, setUserToLocalStorage, signIn, signInGoogle };
});
