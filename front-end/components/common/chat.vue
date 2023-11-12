<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, watchEffect, nextTick } from "vue";
import { useAuthStore, useChatStore } from "~/stores";
import { sendMessage, onEvent } from "~/services/socket";

const authStore = useAuthStore();
const chatStore = useChatStore();
const { user }: any = storeToRefs(authStore);
const { chats, chatCustomerInFo }: any = storeToRefs(chatStore);
const menu = ref(false);
const CUSTOMER_ROLE = 4;
const ADMIN_ROLE = 1;
const ADMIN_CHAT_ACTIVE = "ADMIN";
const CUSTOMER_CHAT_ACTIVE = "CUSTOMER";
const isLoading = ref(false);
const tab = ref(null);
const customerId = ref<number>();
const titleAdmin = "ban quản lý sân";
const titleCustomer = "khách hàng";
const isCustomer = user.value && user.value.roleId === CUSTOMER_ROLE;
const isAdmin = user.value && user.value.roleId === ADMIN_ROLE;
const totalChatStatusUnread = ref(0);
const isAtBottom = ref(true);

if (isAdmin || isCustomer) getTotalStatusUnread();

if (isCustomer) await chatStore.getChatForCustomer();

if (isAdmin && chatCustomerInFo.value && chatCustomerInFo.value.length > 0)
  handleChangeTab(chatCustomerInFo.value[0].id);

watchEffect(async () => {
  if (menu.value || tab.value) {
    const chatStatusUnreadFound = chats.value.filter(
      ({ status }: any) => status === "UNREAD"
    );
    if (
      isCustomer &&
      chatStatusUnreadFound &&
      chatStatusUnreadFound.length > 0
    ) {
      await chatStore.updateChatStatusForCustomer();
      await chatStore.getChatForCustomer();
      getTotalStatusUnread();
    }

    await nextTick();
    scrollToBottomChatBox();
  }
});

onEvent("emit-chat", async (data: any) => {
  const { customerId, id: idChat, active } = data;
  const foundCustomer =
    isAdmin && Array.isArray(chatCustomerInFo.value)
      ? chatCustomerInFo.value.find(({ id }: any) => id === customerId)
      : {};
  const isTabActive = isAdmin && customerId === tab.value;
  const isActiveCustomer = active === CUSTOMER_CHAT_ACTIVE;

  if (
    !foundCustomer ||
    (isActiveCustomer && !isTabActive) ||
    (isActiveCustomer && !menu.value) ||
    isCustomer
  ) {
    getTotalStatusUnread();
  }

  if (isCustomer || isTabActive) {
    const foundChat = chats.value.find(({ id }: any) => id === idChat);

    if (foundChat) return;

    chats.value = [...chats.value, data];
  }
});

function send(message: string) {
  sendMessage("chat", {
    content: message,
    staffId: isCustomer ? ADMIN_ROLE : null,
    customerId: isAdmin ? customerId.value : null,
    active: isCustomer ? CUSTOMER_CHAT_ACTIVE : ADMIN_CHAT_ACTIVE,
    status: "UNREAD",
  });
}

async function handleChangeTab(id: number) {
  isLoading.value = true;
  customerId.value = id;
  await chatStore.getChatForAdmin(id);
  const chatStatusUnreadFound = chats.value.filter(
    ({ status }: any) => status === "UNREAD"
  );

  if (chatStatusUnreadFound && chatStatusUnreadFound.length > 0) {
    await chatStore.updateChatStatus(id);
    getTotalStatusUnread();
  }

  isLoading.value = false;
}

function handleScroll() {
  const messageContainer: any = document.querySelector(".box-message");
  isAtBottom.value =
    Math.ceil(messageContainer.scrollTop) ===
    messageContainer.scrollHeight - messageContainer.offsetHeight;
}

function scrollToBottomChatBox() {
  const messageContainer: any = document.querySelector(".box-message");
  const messageItems: any = document.querySelectorAll(".message");

  if (chats.value && chats.value.length > 0 && messageItems.length === 0) {
    setTimeout(() => {
      scrollToBottomChatBox();
    }, 100);
  }

  if (messageItems.length > 0) {
    const lastMessage = messageItems[messageItems.length - 1];
    messageContainer.scrollTop =
      lastMessage.offsetTop - messageContainer.offsetTop;
  }
}

async function getTotalStatusUnread() {
  await chatStore.getChatCustomerInfo();
  totalChatStatusUnread.value =
    isAdmin && Array.isArray(chatCustomerInFo.value)
      ? chatCustomerInFo.value.reduce((total: number, customerInfo: any) => {
          return (total += customerInfo.totalUnread);
        }, 0)
      : chatCustomerInFo.value.contact.filter(
          ({ status }: any) => status === "UNREAD"
        ).length;
}
</script>
<template>
  <v-menu
    v-if="isAdmin || isCustomer"
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
            '-admin': isAdmin,
          },
        ]"
        :disabled="!user.loggedIn"
      >
        <v-icon>mdi mdi-chat-processing-outline</v-icon>
        <v-badge
          v-if="totalChatStatusUnread > 0"
          color="error"
          :content="totalChatStatusUnread > 9 ? '9+' : totalChatStatusUnread"
          overlap
        />
      </v-btn>
    </template>
    <v-card
      :class="[
        'chat-component',
        {
          '-admin': isAdmin,
        },
      ]"
      :loading="isLoading"
    >
      <v-card-title
        >Liên hệ với {{ isCustomer ? titleAdmin : titleCustomer }}</v-card-title
      >
      <v-divider></v-divider>
      <div v-if="isCustomer" class="customer">
        <common-chat-customer
          :chats="chats"
          :admin-chat-active="ADMIN_CHAT_ACTIVE"
          :customer-chat-active="CUSTOMER_CHAT_ACTIVE"
          @handle-message="send"
          @handle-scroll="handleScroll"
        />
      </div>
      <div class="chat-admin" v-else>
        <div class="tab">
          <common-chat-tabs
            v-model="tab"
            :tabs="chatCustomerInFo"
            @handle-change-tab="handleChangeTab"
          />
        </div>
        <div class="admin">
          <common-chat-admin
            v-if="tab"
            v-model="tabs"
            :tabs="chatCustomerInFo"
            :chats="chats"
            :admin-chat-active="ADMIN_CHAT_ACTIVE"
            :customer-chat-active="CUSTOMER_CHAT_ACTIVE"
            @handle-message="send"
            @handle-scroll="handleScroll"
          />
        </div>
      </div>
      <v-btn v-if="!isAtBottom" class="btndown" @click="scrollToBottomChatBox">
        <v-icon>mdi mdi-arrow-down-thin</v-icon>
      </v-btn>
    </v-card>
  </v-menu>
</template>

<style lang="scss" scoped>
.chat-component {
  position: relative;
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
  > .btndown {
    position: absolute;
    bottom: 100px;
    right: 160px;
    padding: 0;
    height: 30px;
    min-width: 30px;
    border-radius: 50%;
  }
}

.chat-admin {
  display: flex;
  overflow: hidden;
  > .tab {
    width: 50%;
    height: 450px;
    overflow-y: scroll;
    border-right: 1px solid #d6d6d6;
    &::-webkit-scrollbar {
      width: 0;
    }
  }

  > .admin {
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
  :deep(.v-badge) {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>
