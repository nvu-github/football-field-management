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

export const statuses: any = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  DELETED: "Đã xóa",
};

export const useUserStore = defineStore("userStore", () => {
  const { $apis }: any = useNuxtApp();
  const account = ref<Account>();
  const accounts = ref<Account[]>([]);
  const roles = ref<Role[]>([]);

  async function getRoles() {
    const roleList = await $apis.get("users/roles");
    roles.value = roleList.data;
  }

  function createAccount(params: AccountCreate) {
    return $apis.post("users/account", {
      ...convertProjectObjToObj(params),
    });
  }

  function acceptAccount(id: number, status: string) {
    return $apis.patch(`users/account/${id}/accept`, {
      status,
    });
  }

  function updateAccount(id: number, params: AccountCreate) {
    return $apis.patch(`users/account/${id}`, {
      ...convertProjectObjToObj(params),
    });
  }

  async function getAccounts() {
    const allAccounts = await $apis.get("users/accounts");
    accounts.value = allAccounts.data;
  }

  async function getAccount(id: number) {
    const singleAccount = await $apis.get(`users/account/${id}`);
    account.value = singleAccount.data;
  }

  return {
    accounts,
    account,
    roles,
    createAccount,
    updateAccount,
    acceptAccount,
    getAccounts,
    getAccount,
    getRoles,
  };
});
