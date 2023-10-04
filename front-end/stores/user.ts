export interface AccountCreate {
  email: string;
  password: string;
  role: string;
}

export const useUserStore = defineStore("userStore", () => {
  const { $apis } = useNuxtApp();
  const accountCreate = reactive<AccountCreate>({
    email: "",
    password: "",
    role: "",
  });

  function createAccount(params: AccountCreate) {
    return $apis
      .post("users/account", {
        json: {
          params,
        },
      })
      .json();
  }

  return { accountCreate, createAccount };
});
