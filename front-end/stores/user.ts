export interface AccountCreate {
  email: string;
  password: string;
  roleName?: string;
  roleId: number | null;
}

export interface Account {
  name: string;
  email: string;
  role: string;
  roleName: string;
  status: string;
}

export interface Role {
  id: number;
  name: string;
}

export const statuses:any = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Xác nhận",
  DELETED: "Đã xóa"
}

export const useUserStore = defineStore("userStore", () => {
  const { $apis }: any = useNuxtApp();
  const account = ref<Account>()
  const accounts = ref<Account[]>([])
  const roles = ref<Role[]>([])

  async function getRoles() {
    const roleList = await $apis
      .get("users/roles")
      .json();
      roles.value = roleList.data
  }

  function createAccount(params: AccountCreate) {
    return $apis
      .post("users/account", {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  function acceptAccount(id: number, status: string) {
    return $apis
      .patch(`users/account/${id}/accept`, {
        json: {
          status,
        },
      })
      .json();
  }

  function updateAccount(id: number, params: AccountCreate) {
    return $apis
      .patch(`users/account/${id}`, {
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
    const singleAccount = await $apis
      .get(`users/account/${id}`)
      .json();
      account.value = singleAccount.data
  }

  return { accounts, account, roles, createAccount, updateAccount, acceptAccount, getAccounts, getAccount, getRoles };
});
