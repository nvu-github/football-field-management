<script setup lang="ts">
let toggleMenu = ref<Boolean>(true);
function toggleShowNavBar(drawer: Boolean) {
  toggleMenu.value = drawer;
}
</script>
<template>
  <v-app>
    <layout-admin-navbar :toggle-menu="toggleMenu" />
    <layout-admin-header @drawer="toggleShowNavBar" />
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
  padding: 40px 35px;
  min-height: 600px;
  :deep(.v-data-table__th) {
    background: #f2f2f2 !important;
    border-bottom: 1px solid #b3b3b3 !important;
  }
}
</style>
