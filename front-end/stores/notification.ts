export interface Notification {
  id: number;
  title: string;
  content: string;
  status: string;
  customerId: number;
  customerName: string;
  customerAvatar: string;
}

export const useNotificationStore = defineStore("notificationStore", () => {
  const { $apis }: any = useNuxtApp();
  const notifications = ref<Notification[]>([]);

  async function getNotifications() {
    const notificationList = await $apis.get("notifications");
    notifications.value = notificationList.data;
  }
  return { notifications, getNotifications };
});
