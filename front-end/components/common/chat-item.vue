<script lang="ts" setup>
import { format } from "date-fns";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  prevCreatedAt: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const isCreatedDateNow = props.prevCreatedAt
  ? format(new Date(props.createdAt), "dd/MM/yyyy") !==
    format(new Date(props.prevCreatedAt), "dd/MM/yyyy")
  : false;
</script>
<template>
  <div>
    <div class="chat-item">
      <p v-if="isCreatedDateNow" class="senddate">
        {{ format(new Date(props.createdAt), "dd/MM/yyyy") }}
      </p>
      <div
        :class="[
          'content',
          {
            '-active': props.isActive,
          },
        ]"
      >
        <img class="icon" :src="avatar" />
        <div
          :class="[
            'message',
            {
              '-active': props.isActive,
            },
          ]"
        >
          {{ props.message }}
        </div>
      </div>
      <span
        :class="[
          'timmer',
          {
            '-active': isActive,
          },
        ]"
      >
        {{ format(new Date(props.createdAt), "HH:mm") }}</span
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-item {
  padding: 10px 10px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-self: flex-end;

  > .senddate {
    text-align: center;
    padding: 0 0 15px;
    opacity: 0.7;
    font-weight: bold;
  }

  > .content {
    display: inline-flex;
    &.-active {
      flex-direction: row-reverse;
    }
  }

  > .content > .icon {
    width: 20px;
    object-fit: contain;
  }

  > .content > .message {
    min-width: 60px;
    max-width: 700px;
    padding: 14px 18px;
    margin: 6px 8px;
    background-color: #dbdbdb;
    border-radius: 16px 16px 16px 0;
    border: 1px solid #dbdbdb;
    color: #000;

    &.-active {
      background-color: #a9ca31;
      border-radius: 16px 16px 0 16px;
      border: 1px solid #a9ca31;
    }
  }

  > .timmer {
    align-self: flex-start;
    margin-left: 30px;
    font-size: 14px;
    color: grey;
    &.-active {
      align-self: flex-end;
      margin-right: 30px;
    }
  }
}
</style>
