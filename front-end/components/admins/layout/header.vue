<script setup lang="ts">
import { useAppStore } from "~/stores";
const appStore = useAppStore();
const { app, isShowSidebar } = storeToRefs(appStore);

function handleShowMenu() {
  isShowSidebar.value = !isShowSidebar.value;
}
</script>
<template>
  <v-app-bar class="header">
    <div class="sidebar">
      <v-icon class="icon" @click="handleShowMenu"> mdi mdi-menu </v-icon>
      <div class="title">
        {{ app.title }}
      </div>
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

  :deep(.v-toolbar__content) > .sidebar {
    display: flex;
    align-items: center;
    margin-left: 15px;
  }

  :deep(.v-toolbar__content) > .sidebar > .title {
    margin-left: 15px;
    font-size: 20px;
    font-weight: bold;
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
