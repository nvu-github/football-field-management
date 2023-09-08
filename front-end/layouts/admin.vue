<template>
  <v-app>
    <layout-admin-navbar />
    <layout-admin-header />
    <v-main>
      <div class="main">
        <slot />
      </div>
      <layout-admin-footer />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.main {
  padding: 30px 20px;
  min-height: 600px;
}
</style>
