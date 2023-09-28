<script setup lang="ts">
import { defineEmits } from "vue";
let drawer = true;
const emit = defineEmits(["drawer"]);

function handleShowMenu() {
  drawer = !drawer;
  emit("drawer", drawer);
}
</script>
<template>
  <v-app-bar class="header">
    <div class="sidebaricon">
      <v-icon class="icon" @click="handleShowMenu"> mdi mdi-menu </v-icon>
    </div>
    <div class="action">
      <common-notification class="notification" />
      <common-user class="user" />
    </div>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.header {
  :deep(.v-toolbar__content) {
    justify-content: space-between;
  }

  :deep(.v-toolbar__content) > .sidebaricon {
    margin-left: 15px;
  }

  :deep(.v-toolbar__content) > .action {
    display: flex;
    align-items: center;
  }

  :deep(.v-toolbar__content) > .action > .user {
    margin-left: 10px;
  }

  :deep(.user) {
    padding-right: 20px;
    cursor: pointer;

    > .v-avatar {
      margin-right: 10px;
    }
  }
}
</style>
