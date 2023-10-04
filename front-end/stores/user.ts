export interface AccountCreate {
  email: string;
  password: string;
  roleId: string;
}

export interface Account {
  name: string;
  email: string;
  role: string;
  status: string;
}

export const statuses:any = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Xác nhận",
  DELETED: "Đã xóa"
}

export const useUserStore = defineStore("userStore", () => {
  const { $apis } = useNuxtApp();
  const accountCreate = reactive<AccountCreate>({
    email: "",
    password: "",
    role: "",
  });
  const accounts = ref<Account[]>([])

  function createAccount(params: AccountCreate) {
    return $apis
      .post("users/account", {
        json: {
          params,
        },
      })
      .json();
  }

  async function getAccounts() {
    const allAccounts = await $apis
      .get("users/accounts")
      .json();
      accounts.value = allAccounts.data
  }

  return { accountCreate, accounts, createAccount, getAccounts };
});
