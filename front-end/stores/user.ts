export interface AccountCreate {
  email: string
  password: string
  role: string
}

export const useUserStore = defineStore("userStore", () => {
  const accountCreate = reactive<AccountCreate>({
    email: '',
    password: '',
    role: ''
  });

  return { accountCreate };
});