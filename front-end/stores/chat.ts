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
  totalUnread: number;
}

export const useChatStore = defineStore("chatStore", () => {
  const { $apis }: any = useNuxtApp();
  const chats = ref<Chat[]>([]);
  const chatCustomerInFo = ref<ChatCustomerInfoForAdmin[]>([]);

  async function updateChatStatus(customerId: number) {
    return $apis.patch(`chats/customer/${customerId}`);
  }

  async function updateChatStatusForCustomer() {
    return $apis.patch(`chats/customer/status`);
  }

  async function getChatForCustomer() {
    const chatForCustomerList = await $apis.get(`chats/customer`);
    chats.value = chatForCustomerList.data;
  }

  async function getChatForAdmin(id: number) {
    const chatForCustomerList = await $apis.get(`chats/admin/customer/${id}`);
    chats.value = chatForCustomerList.data;
  }

  async function getChatCustomerInfo() {
    const chatCustomerInfoList = await $apis.get(`chats/customer/info`);
    chatCustomerInFo.value = chatCustomerInfoList.data;
  }

  return {
    chats,
    chatCustomerInFo,
    updateChatStatus,
    updateChatStatusForCustomer,
    getChatForCustomer,
    getChatForAdmin,
    getChatCustomerInfo,
  };
});
