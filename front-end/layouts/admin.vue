<script lang="ts" setup>
const appStore = useAppStore();
const { app } = storeToRefs(appStore);
const { title } = app.value;
useHead({
  title: title || "Sân bóng Hoàng Quân",
});
let toggleMenu = ref<Boolean>(true);
function toggleShowNavBar(drawer: Boolean) {
  toggleMenu.value = drawer;
}
</script>
<template>
  <v-app>
    <admins-layout-navbar :toggle-menu="toggleMenu" />
    <admins-layout-header @drawer="toggleShowNavBar" />
    <v-main>
      <div class="main">
        <slot />
      </div>
      <admins-layout-footer />
    </v-main>
    <common-dialog />
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
