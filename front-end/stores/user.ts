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

export interface PersonalInfo {
  id?: number;
  name: string;
  teamName?: string;
  phoneNumber: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  avatar?: string;
  email?: string;
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
  const personalInfo = ref<PersonalInfo>({});

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

  function updatePersonalInfoCustomer(params: PersonalInfo) {
    delete params.id;
    delete params.email;
    if (!params.avatar) {
      delete params.avatar;
    }
    return $apis.patch(`users/personal-info/customer`, {
      ...convertProjectObjToObj(params),
    });
  }

  function updatePersonalInfoStaff(params: PersonalInfo) {
    return $apis.patch(`users/personal-info/staff`, {
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

  async function getCustomerInfo() {
    const customerInfoApi = await $apis.get(`users/personal-info/customer`);
    personalInfo.value = customerInfoApi.data;
  }

  async function getStaffInfo() {
    const customerInfoApi = await $apis.get(`users/personal-info/staff`);
    personalInfo.value = customerInfoApi.data;
  }

  return {
    accounts,
    account,
    roles,
    personalInfo,
    createAccount,
    updateAccount,
    updatePersonalInfoStaff,
    updatePersonalInfoCustomer,
    acceptAccount,
    getAccounts,
    getAccount,
    getRoles,
    getCustomerInfo,
    getStaffInfo,
  };
});
