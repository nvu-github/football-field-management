<template>
  <v-app class="layout-default">
    <div class="layout-header">
      <layout-user-header class="header" />
    </div>
    <div class="layout-toolbar">
      <layout-user-toolbar class="toolbar" />
    </div>
    <div class="main">
      <slot />
    </div>
    <layout-user-footer class="footer" />
  </v-app>
</template>
<style lang="scss" scoped>
.layout-default {
  :deep(.v-application__wrap) > .header {
    border-top: 2px solid #a9ca31;
  }
}

.layout-header > .header {
  max-width: 1200px;
  margin: 0 auto;
}

.layout-toolbar {
  background-color: #a9ca31;
  > .toolbar {
    max-width: 1200px;
    margin: 0 auto;
  }
  > .toolbar > :deep(.app-header) > .v-toolbar__content > .v-toolbar {
    background-color: #a9ca31 !important;
  }
}

.main {
  margin: 0 auto;
  padding: 10px 20px;
  max-width: 1200px;
  min-height: 500px;
}

.footer {
  margin: 0 auto;
  padding: 10px 20px;
  width: 100%;
  background-color: #a9ca31;
}
</style>
