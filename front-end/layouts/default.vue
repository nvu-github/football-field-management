<template>
  <v-app class="layout-default">
    <div class="header">
      <v-container class="container">
        <layout-user-header />
        <layout-user-toolbar />
      </v-container>
    </div>
    <v-container>
      <div class="main">
        <slot />
      </div>
    </v-container>
    <layout-user-footer />
  </v-app>
</template>
<style lang="scss" scoped>
.layout-default {
  :deep(.header) {
    border-top: 2px solid #a9ca31;
  }
  :deep(.header) > .container {
    padding-top: 0;
  }
}
.main {
  min-height: 500px;
  padding: 30px 25px;
}
</style>
