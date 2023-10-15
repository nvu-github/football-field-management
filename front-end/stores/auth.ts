export interface User {
  name: string | null;
  email: string | null;
  roleId: number | null;
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
    return $apis.post("auth/login", {
      ...params,
    });
  }

  function signInGoogle(idToken: string) {
    return $apis.post("auth/login-google", {
      idToken,
    });
  }

  function setUserToLocalStorage() {
    const userLoggedIn = localStorage.getItem("userLogin");
    if (userLoggedIn) {
      user.value = JSON.parse(userLoggedIn);
    }
  }

  function signOut() {
    return new Promise((resolve, reject) => {
      localStorage.removeItem("userLogin");
      resolve();
    });
  }

  return { user, setUserToLocalStorage, signIn, signInGoogle, signOut };
});
