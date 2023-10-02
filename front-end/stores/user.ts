export interface AccountCreate {
  email: string
  password: string
  role: ''
}

enum Role {
  STAFF,
  CUSTOMER
}

export const useUserStore = defineStore("userStore", () => {
  const accountCreate = reactive<AccountCreate>({
    email: '',
    password: '',
    role: ''
  });

  return { accountCreate };
});