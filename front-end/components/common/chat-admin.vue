<script lang="ts" setup>
import adminAvatar from "~/public/admin.png";
import userAvatar from "~/public/user-avatar.png";
import { computed, ref } from "vue";

const props: any = defineProps({
  vModel: {
    type: String,
    default: "",
  },
  tabs: {
    type: Array<{
      id: number;
      name: string;
    }>,
    required: true,
  },
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

const emit = defineEmits([
  "update:modelValue",
  "handleMessage",
  "handleScroll",
]);
const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const message = ref();

function handleMessage() {
  emit("handleMessage", message.value);
  message.value = null;
}

function handleScroll() {
  emit("handleScroll");
}
</script>
<template>
  <v-window v-model="vModel">
    <v-window-item v-for="(tab, index) in tabs" :key="index" :value="tab.id">
      <v-card flat>
        <v-card-text class="box-message" @scroll="handleScroll">
          <common-chat-item
            v-for="(chat, index) in chats"
            :key="index"
            :message="chat.content"
            :created-at="chat.createdAt"
            :prev-created-at="index > 0 ? chats[index - 1].createdAt : ''"
            :is-active="chat.active === props.adminChatActive"
            :avatar="
              chat.active === props.adminChatActive ? adminAvatar : userAvatar
            "
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
      </v-card>
    </v-window-item>
  </v-window>
</template>
<style lang="scss" scoped>
.box-message {
  overflow-y: auto;
  padding-right: 0;
  padding-left: 0;
  &::-webkit-scrollbar {
    width: 8px;
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
