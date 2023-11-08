<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, watch, nextTick } from "vue";
import { useAuthStore, useChatStore } from "~/stores";
import { sendMessage, onEvent } from "~/services/socket";

const authStore = useAuthStore();
const chatStore = useChatStore();
const { user }: any = storeToRefs(authStore);
const { chats, chatCustomerInfForAdmin }: any = storeToRefs(chatStore);
const menu = ref(false);
const message = ref<any>(null);
const CUSTOMER_ROLE = 4;
const ADMIN_ROLE = 1;
const ADMIN_CHAT_ACTIVE = "ADMIN";
const CUSTOMER_CHAT_ACTIVE = "CUSTOMER";
const isLoading = ref(false);
const tab = ref(null);
const customerId = ref<number>();

if (user.value.roleId === CUSTOMER_ROLE) await chatStore.getChatForCustomer();
if (user.value.roleId === ADMIN_ROLE) {
  await chatStore.getChatCustomerInfoForAdmin();
  tab.value = ref(chatCustomerInfForAdmin.value[0].id);
}

watch(menu, async (newVal) => {
  if (newVal) {
    await nextTick();
    const messageItems: any = document.querySelectorAll(".message");
    const messageContainer: any = document.querySelector(".v-card-text");
    if (messageItems.length > 0) {
      const lastMessage = messageItems[messageItems.length - 1];
      messageContainer.scrollTop =
        lastMessage.offsetTop - messageContainer.offsetTop;
    }
  }
});

onEvent("emit-chat", function (data: any) {
  const { customerId } = data;
  if (user.value.roleId === CUSTOMER_ROLE) {
    chats.value = [...chats.value, data];
  } else {
    if (customerId === tab) chats.value = [...chats.value, data];
  }
});

function send() {
  sendMessage("chat", {
    content: message.value,
    staffId: user.value.roleId === CUSTOMER_ROLE ? ADMIN_ROLE : null,
    customerId: user.value.roleId !== CUSTOMER_ROLE ? customerId.value : null,
    active:
      user.value.roleId === CUSTOMER_ROLE
        ? CUSTOMER_CHAT_ACTIVE
        : ADMIN_CHAT_ACTIVE,
  });
  message.value = null;
}

async function getChatContent(id: number) {
  isLoading.value = true;
  customerId.value = id;
  await chatStore.getChatForAdmin(id);
  isLoading.value = false;
}
</script>
<template>
  <v-menu
    v-if="user.roleId === ADMIN_ROLE || user.roleId === CUSTOMER_ROLE"
    v-model="menu"
    location="top"
    persistent
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        :class="[
          'btn',
          {
            '-admin': user.roleId === ADMIN_ROLE,
          },
        ]"
        v-bind="props"
        active-class="false"
        :disabled="!user.loggedIn"
      >
        <v-icon>mdi mdi-chat-processing-outline</v-icon>
      </v-btn>
    </template>
    <v-card
      class="chat-component"
      :width="user.roleId === ADMIN_ROLE ? 550 : 350"
      :min-height="user.roleId === ADMIN_ROLE ? 500 : 400"
      :loading="isLoading"
    >
      <v-card-title>Liên hệ với ban quản lý sân</v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="user.roleId === CUSTOMER_ROLE">
        <common-chat-item
          v-for="(chat, index) in chats"
          :key="index"
          :class="[
            'message',
            {
              '-active': chat.active === CUSTOMER_CHAT_ACTIVE,
            },
          ]"
          :message="chat.content"
          :timer="chat.createdAt"
          :is-active="chat.active === CUSTOMER_CHAT_ACTIVE"
        />
      </v-card-text>
      <v-card-text class="chat-admin" v-else>
        <div class="tab">
          <v-tabs v-model="tab" direction="vertical" color="primary">
            <v-tab
              v-for="(customer, index) in chatCustomerInfForAdmin"
              :key="index"
              :value="customer.id"
              @click="getChatContent(customer.id)"
            >
              <v-icon start> mdi-account </v-icon>
              {{ customer.name }}
            </v-tab>
          </v-tabs>
        </div>
        <div class="window">
          <v-window v-model="tab">
            <v-window-item
              v-for="(customer, index) in chatCustomerInfForAdmin"
              :key="index"
              :value="customer.id"
            >
              <v-card flat>
                <v-card-text>
                  <common-chat-item
                    v-for="(chat, index) in chats"
                    :key="index"
                    :class="[
                      'message',
                      {
                        '-active': chat.active === ADMIN_CHAT_ACTIVE,
                      },
                    ]"
                    :message="chat.content"
                    :timer="chat.createdAt"
                    :is-active="chat.active === ADMIN_CHAT_ACTIVE"
                  />
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-textarea
          v-model="message"
          label="Nội dung tin nhắn..."
          hide-details="auto"
          variant="underlined"
          rows="1"
        >
          <template #append>
            <v-btn :disabled="!message" @click="send">
              <v-icon>mdi mdi-send-variant-outline</v-icon>
            </v-btn>
          </template>
        </v-textarea>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style lang="scss" scoped>
.chat-component {
  margin-bottom: 10px;
  > .v-card-title {
    font-weight: bold;
  }
  > .v-card-text {
    height: 290px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  > .v-card-actions {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-bottom: 10px;
    border-top: 1px solid #d6d6d6;
    background: #fff;
  }
  > .v-card-actions :deep(.v-field__input) {
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}

.chat-admin {
  display: flex;
  height: 380px !important;
  overflow: hidden;
  > .tab {
    width: 45%;
    height: 100%;
    overflow-y: scroll;
    border-right: 1px solid #d6d6d6;
    &::-webkit-scrollbar {
      width: 0;
    }
  }

  > .window {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}

.message {
  width: 100%;
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 25px;
  }
  &.-active {
    float: right;
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
  :deep(.v-btn__content) > .v-icon {
    color: white;
    font-size: 40px;
  }
  &.-admin {
    bottom: 60px;
  }
}
</style>
