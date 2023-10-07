export interface AccountCreate {
  email: string;
  password: string;
  roleId: number | null;
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
  const account = ref<Account>()
  const accounts = ref<Account[]>([])

  function createAccount(params: AccountCreate) {
    return $apis
      .post("users/account", {
        json: {
          ...convertProjectObjToObj(params),
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

  async function getAccount(id: number) {
    const Account = await $apis
      .get(`users/account/${id}`)
      .json();
      account.value = Account.data
  }

  return { accounts, account, createAccount, getAccounts, getAccount };
});
