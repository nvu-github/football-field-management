<script lang="ts" setup>
import { format } from "date-fns";
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  timer: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});
</script>
<template>
  <div class="chat-item">
    <div
      :class="[
        'message',
        {
          '-active': isActive,
        },
      ]"
    >
      <p
        :class="[
          'content',
          {
            '-active': isActive,
          },
        ]"
      >
        {{ props.message }}
      </p>
      <p
        :class="[
          'timer',
          {
            '-active': isActive,
          },
        ]"
      >
        {{ format(new Date(props.timer), "HH:mm") }}
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-item {
  > .message {
    position: relative;
    display: inline-block;
    max-width: 90%;
    &.-active {
      float: right;
    }
  }

  > .message > .content {
    padding: 5px 10px;
    border-radius: 20px;
    background: #dbdbdb;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    &.-active {
      background: #a9ca31;
    }
  }

  > .message > .timer {
    position: absolute;
    margin: 0 5px;
    &.-active {
      right: 0;
      text-align: end;
    }
  }
}
</style>
