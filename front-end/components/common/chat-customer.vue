<script lang="ts" setup>
import { ref } from "vue";

const props: any = defineProps({
  chats: {
    type: Array<Chat>,
    required: true,
  },
  adminChatActive: {
    type: String,
    required: true,
  },
  customerChatActive: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["handleMessage"]);
const message = ref();

function handleMessage() {
  emit("handleMessage", message.value);
  message.value = null;
}
</script>
<template>
  <div class="chat-customer-component">
    <v-card-text class="box-message">
      <common-chat-item
        v-for="(chat, index) in chats"
        :key="index"
        :class="[
          'message',
          {
            '-active': chat.active === props.customerChatActive,
          },
        ]"
        :message="chat.content"
        :timer="chat.createdAt"
        :is-active="chat.active === props.customerChatActive"
      />
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
          <v-btn :disabled="!message" @click="handleMessage">
            <v-icon>mdi mdi-send-variant-outline</v-icon>
          </v-btn>
        </template>
      </v-textarea>
    </v-card-actions>
  </div>
</template>
<style lang="scss" scoped>
.chat-customer-component {
  > .v-card-actions {
    position: relative;
  }
  > .box-message {
    overflow-y: auto;
    height: 350px;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px #d8d7d7;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #a9ca31;
    }
    &::-webkit-scrollbar-button {
      display: none;
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

.v-card-actions {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-bottom: 10px;
  border-top: 1px solid #d6d6d6;
  background: #fff;
  :deep(.v-field__input) {
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>
