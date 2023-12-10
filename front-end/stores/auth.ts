export interface User {
  name: string | null;
  email: string | null;
  roleId: number | null;
  avatar?: string | null;
  loggedIn: boolean;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  name: string;
  phoneNumber: string;
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

  function signUp(params: Register) {
    return $apis.post("auth/signup", {
      ...params,
    });
  }

  function setUserInfoFromLocalStorage() {
    const userLoggedIn = localStorage.getItem("userLogin");
    if (userLoggedIn) {
      user.value = JSON.parse(userLoggedIn);
    }
  }

  function signOut() {
    localStorage.removeItem("userLogin");
  }

  return {
    user,
    setUserInfoFromLocalStorage,
    signIn,
    signUp,
    signInGoogle,
    signOut,
  };
});
