export interface Chat {
  id: number;
  content: string;
  image: JSON;
  staffId: string;
  customerId: number;
  active: string;
  createdAt: string;
}

export interface ChatCustomerInfoForAdmin {
  id: number;
  name: string;
}

export const useChatStore = defineStore("chatStore", () => {
  const { $apis }: any = useNuxtApp();
  const chats = ref<Chat[]>([]);
  const chatCustomerInForAdmin = ref<ChatCustomerInfoForAdmin[]>([]);

  async function getChatForCustomer() {
    const chatForCustomerList = await $apis.get(`chats/customer`);
    chats.value = chatForCustomerList.data;
  }

  async function getChatForAdmin(id: number) {
    const chatForCustomerList = await $apis.get(`chats/admin/customer/${id}`);
    chats.value = chatForCustomerList.data;
  }

  async function getChatCustomerInfoForAdmin() {
    const chatCustomerInfoList = await $apis.get(`chats/customer/info`);
    chatCustomerInForAdmin.value = chatCustomerInfoList.data;
  }

  return {
    chats,
    chatCustomerInForAdmin,
    getChatForCustomer,
    getChatForAdmin,
    getChatCustomerInfoForAdmin,
  };
});
