<template>
  <v-app-bar class="header">
    <common-notification />
    <common-user />
  </v-app-bar>
</template>

<style lang="scss" scoped>
.header {
  :deep(.v-toolbar__content) {
    height: 56px !important;
    justify-content: flex-end;
  }

  :deep(.user) {
    padding: 20px;
    cursor: pointer;

    > .v-avatar {
      margin-right: 10px;
    }
  }
}
</style>
