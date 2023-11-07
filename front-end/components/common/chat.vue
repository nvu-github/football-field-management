<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, watch, nextTick } from "vue";
import { useAuthStore, useChatStore } from "~/stores";
import { sendMessage, onEvent } from "~/services/socket";

const authStore = useAuthStore();
const chatStore = useChatStore();
const { user }: any = storeToRefs(authStore);
const { chatForCustomer }: any = storeToRefs(chatStore);
const menu = ref(false);
const message = ref<any>(null);
const CUSTOMER_ROLE = 4;

if (user.value.roleId === CUSTOMER_ROLE) await chatStore.getChatForCustomer();

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
  chatForCustomer.value = [...chatForCustomer.value, data];
});

function send() {
  sendMessage("chat", {
    content: message.value,
    staffId: user.value.roleId === CUSTOMER_ROLE ? 1 : null,
    customerId: user.value.roleId !== CUSTOMER_ROLE ? user.value.email : null,
    active: "CUSTOMER",
  });
  message.value = null;
}
</script>
<template>
  <v-menu
    v-model="menu"
    location="top"
    persistent
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        class="btn"
        v-bind="props"
        active-class="false"
        :disabled="!user.loggedIn"
      >
        <v-icon>mdi mdi-chat-processing-outline</v-icon>
      </v-btn>
    </template>
    <v-card class="chat-component" width="350" min-height="400">
      <v-card-title>Liên hệ với ban quản lý sân</v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="user.roleId === CUSTOMER_ROLE">
        <common-chat-item
          v-for="(chat, index) in chatForCustomer"
          :key="index"
          :class="[
            'message',
            {
              '-active': chat.active === 'CUSTOMER',
            },
          ]"
          :message="chat.content"
          :timer="chat.createdAt"
          :is-active="chat.active === 'CUSTOMER'"
        />
        <!-- <common-chat-item
          class="message -active"
          message="Ok, Hello"
          timer="10:30"
          is-active
        />
        <common-chat-item class="message" message="Hello" timer="10:30" />
        <common-chat-item
          class="message -active"
          message="Ok, Hello"
          timer="10:30"
          is-active
        />
        <common-chat-item class="message" message="Hello" timer="10:30" />
        <common-chat-item
          class="message -active"
          message="Ok, Hello"
          timer="10:30"
          is-active
        />
        <common-chat-item class="message" message="Hello" timer="10:30" />
        <common-chat-item
          class="message -active"
          message="Ok, Hello"
          timer="10:30"
          is-active
        />
        <common-chat-item class="message" message="Hello" timer="10:30" />
        <common-chat-item
          class="message -active"
          message="Ok, Hello"
          timer="10:30"
          is-active
        />
        <common-chat-item class="message" message="Hello" timer="10:30" />
        <common-chat-item
          class="message -active"
          message="Ok, Hello"
          timer="10:30"
          is-active
        />
        <common-chat-item class="message" message="Hello" timer="10:30" />
        <common-chat-item
          class="message -active"
          message="Ok, Hellopoiuywerasdasdasdasasasdasdasdasdasasdasdasdwerwerwerew"
          timer="10:30"
          is-active
        /> -->
      </v-card-text>
      <v-card-actions>
        <v-text-field
          v-model="message"
          label="Nội dung tin nhắn..."
          hide-details="auto"
          variant="underlined"
        >
          <template #append>
            <v-btn :disabled="!message" @click="send">
              <v-icon>mdi mdi-send-variant-outline</v-icon>
            </v-btn>
          </template>
        </v-text-field>
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
  > .v-card-text > .message {
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
  > .v-card-actions {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-bottom: 10px;
    border-top: 1px solid #d6d6d6;
    background: #fff;
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
}
</style>
