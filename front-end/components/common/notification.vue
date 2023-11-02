<script lang="ts" setup>
import userImg from "~/public/user.jpg";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRuntimeConfig } from "nuxt/app";
import { useNotificationStore } from "~/stores";

import { onEvent } from "~/services/socket";

const runtimeConfig = useRuntimeConfig();
const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);
const menu = ref(false);
const totalNotificationUnRead = ref<number>(0);
await notificationStore.getNotifications();

totalNotificationUnRead.value = notifications.value.filter(
  (notification: any) => notification.status === "UNREAD"
).length;

onEvent("emit-notification", function (data: any) {
  notifications.value.push(data);
  totalNotificationUnRead.value += 1;
});
</script>
<template>
  <v-menu v-model="menu">
    <template #activator="{ props }">
      <v-btn v-bind="props" active-class="false">
        <v-badge color="error" :content="totalNotificationUnRead" overlap>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card min-width="300">
      <div class="header">
        <div class="title">Thông báo</div>
        <a class="skip">Đánh dấu là đã xem</a>
      </div>
      <v-divider></v-divider>

      <v-list v-if="notifications && notifications.length > 0">
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          to="/admin/football-pitches/rental/confirm"
          link
          :class="{
            unread: notification.status === 'UNREAD',
          }"
        >
          <template #prepend>
            <v-img
              class="avatar"
              width="50"
              :src="
                notification.customerAvatar
                  ? `${runtimeConfig.public.API_URL}public/${notification.customerAvatar}`
                  : userImg
              "
            />
          </template>
          <v-list-item-title>{{ notification.title }}</v-list-item-title>
          <v-list-item-content>
            Khách hàng <b>{{ notification.customerName }}</b> đã yêu cầu đặt
            sân:
            <b>{{ notification.content }}</b>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <p v-else class="empty">Không có thông báo</p>
    </v-card>
  </v-menu>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  > .title {
    font-size: 20px;
    font-weight: bold;
  }

  .skip {
    right: 0;
  }
}

.v-list-item {
  :deep(.v-list-item__prepend) {
    margin-right: 10px;
  }
}

.unread {
  background: #ececec;
}

.empty {
  margin: 10px;
  text-align: center;
  font-size: 15px;
}
</style>
