export interface User {
  username: string;
  email: string;
  loggedIn: string;
}

export interface loginPayload {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("authStore", () => {
  const { $apis } = useNuxtApp();
  const user = reactive<User>({});

  function signIn(params: UserLogin) {
    return $apis
      .post("auth/login", {
        json: params,
      })
      .json();
  }

  function setUserToLocalStorage() {
    const userLoggedIn = localStorage.getItem("userLogin");
    if (userLoggedIn) {
      const { username, email, loggedIn } = JSON.parse(userLoggedIn);
      user.username = username;
      user.email = email;
      user.loggedIn = loggedIn;
    }
  }

  return { user, setUserToLocalStorage, signIn };
});
