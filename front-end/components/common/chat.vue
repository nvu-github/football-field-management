<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, watchEffect, nextTick } from "vue";
import { useAuthStore, useChatStore } from "~/stores";
import { sendMessage, onEvent } from "~/services/socket";

const authStore = useAuthStore();
const chatStore = useChatStore();
const { user }: any = storeToRefs(authStore);
const { chats, chatCustomerInForAdmin }: any = storeToRefs(chatStore);
const menu = ref(false);
const message = ref<any>(null);
const CUSTOMER_ROLE = 4;
const ADMIN_ROLE = 1;
const ADMIN_CHAT_ACTIVE = "ADMIN";
const CUSTOMER_CHAT_ACTIVE = "CUSTOMER";
const isLoading = ref(false);
const tab = ref(null);
const customerId = ref<number>();
const titleAdmin = "ban quản lý sân";
const titleCustomer = "khách hàng";

if (user.value && user.value.roleId === CUSTOMER_ROLE)
  await chatStore.getChatForCustomer();

if (user.value && user.value.roleId === ADMIN_ROLE) {
  await chatStore.getChatCustomerInfoForAdmin();
  tab.value =
    chatCustomerInForAdmin.value && chatCustomerInForAdmin.value.length > 0
      ? chatCustomerInForAdmin.value[0].id
      : null;

  if (chatCustomerInForAdmin.value && chatCustomerInForAdmin.value.length > 0)
    handleChangeTab(chatCustomerInForAdmin.value[0].id);
}

watchEffect(async () => {
  if (menu.value || tab.value) {
    await nextTick();
    const messageItems: any = document.querySelectorAll(".message");
    const messageContainer: any = document.querySelector(".box-message");
    if (messageItems.length > 0) {
      const lastMessage = messageItems[messageItems.length - 1];
      messageContainer.scrollTop =
        lastMessage.offsetTop - messageContainer.offsetTop;
    }
  }
});

onEvent("emit-chat", async (data: any) => {
  const { customerId, id: idChat } = data;
  const foundCustomer = chatCustomerInForAdmin.value.find(
    ({ id }: any) => id === customerId
  );

  if (!foundCustomer) await chatStore.getChatCustomerInfoForAdmin();

  if (user.value.roleId === CUSTOMER_ROLE || customerId === tab.value) {
    const foundChat = chats.value.find(({ id }: any) => id === idChat);
    if (foundChat) return;
    chats.value = [...chats.value, data];
  }
});

function send(message: string) {
  sendMessage("chat", {
    content: message,
    staffId:
      user.value && user.value.roleId === CUSTOMER_ROLE ? ADMIN_ROLE : null,
    customerId:
      user.value && user.value.roleId !== CUSTOMER_ROLE
        ? customerId.value
        : null,
    active:
      user.value && user.value.roleId === CUSTOMER_ROLE
        ? CUSTOMER_CHAT_ACTIVE
        : ADMIN_CHAT_ACTIVE,
  });
}

async function handleChangeTab(id: number) {
  isLoading.value = true;
  customerId.value = id;
  await chatStore.getChatForAdmin(id);
  isLoading.value = false;
}
</script>
<template>
  <v-menu
    v-if="user && (user.roleId === ADMIN_ROLE || user.roleId === CUSTOMER_ROLE)"
    v-model="menu"
    location="top"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        active-class="false"
        :class="[
          'btn',
          {
            '-admin': user && user.roleId === ADMIN_ROLE,
          },
        ]"
        :disabled="!user.loggedIn"
      >
        <v-icon>mdi mdi-chat-processing-outline</v-icon>
      </v-btn>
    </template>
    <v-card
      :class="[
        'chat-component',
        {
          '-admin': user && user.roleId === ADMIN_ROLE,
        },
      ]"
      :loading="isLoading"
    >
      <v-card-title
        >Liên hệ với
        {{
          user && user.roleId === CUSTOMER_ROLE ? titleAdmin : titleCustomer
        }}</v-card-title
      >
      <v-divider></v-divider>
      <div v-if="user && user.roleId === CUSTOMER_ROLE" class="customer">
        <common-chat-customer
          :chats="chats"
          :admin-chat-active="ADMIN_CHAT_ACTIVE"
          :customer-chat-active="CUSTOMER_CHAT_ACTIVE"
          @handle-message="send"
        />
      </div>
      <div class="chat-admin" v-else>
        <div class="tab">
          <common-chat-tabs
            v-model="tab"
            :tabs="chatCustomerInForAdmin"
            @handle-change-tab="handleChangeTab"
          />
        </div>
        <div class="window">
          <common-chat-window
            v-model="tabs"
            :tabs="chatCustomerInForAdmin"
            :chats="chats"
            :admin-chat-active="ADMIN_CHAT_ACTIVE"
            :customer-chat-active="CUSTOMER_CHAT_ACTIVE"
            @handle-message="send"
          />
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<style lang="scss" scoped>
.chat-component {
  margin-bottom: 10px;
  width: 350px;
  height: 400px;
  &.-admin {
    width: 550px;
    height: 500px;
  }
  > .v-card-title {
    font-weight: bold;
  }
}

.chat-admin {
  display: flex;
  overflow: hidden;
  padding-right: 5px;
  > .tab {
    width: 45%;
    height: 450px;
    overflow-y: scroll;
    border-right: 1px solid #d6d6d6;
    &::-webkit-scrollbar {
      width: 0;
    }
  }

  > .window {
    width: 100%;
    height: 370px;
    :deep(.v-card-actions) {
      width: 67%;
    }
    :deep(.v-input__append) {
      padding-top: 15px;
    }
    :deep(.v-card-text) {
      height: 370px;
    }
  }
}
.btn {
  position: fixed;
  right: 20px;
  bottom: 30px;
  border-radius: 50%;
  min-width: 0;
  width: 60px;
  height: 60px;
  background: #1ab3ca;
  text-transform: none;
  :deep(.v-btn__content) > .v-icon {
    color: white;
    font-size: 40px;
  }
  &.-admin {
    bottom: 60px;
  }
}
</style>
