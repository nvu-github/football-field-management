export interface ChatForCustomer {
  id: number;
  content: string;
  image: JSON;

  status: string;
  staffId: string;
  customerId: number;
  active: string;
  createdAt: string;
}

export const useChatStore = defineStore("chatStore", () => {
  const { $apis }: any = useNuxtApp();
  const chatForCustomer = ref<Notification[]>([]);

  async function getChatForCustomer() {
    const chatForCustomerList = await $apis.get(`chats/customer`);
    chatForCustomer.value = chatForCustomerList.data;
  }
  return { chatForCustomer, getChatForCustomer };
});
