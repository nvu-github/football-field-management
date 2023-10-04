<script lang="ts" setup>
import { useAppStore } from "~/stores";
const appStore = useAppStore();
const { app, isShowSidebar } = storeToRefs(appStore);
const { title } = app.value;
useHead({
  title: title || "Sân bóng Hoàng Quân",
});
</script>
<template>
  <v-app>
    <admins-layout-navbar />
    <admins-layout-header />
    <v-main>
      <div class="main">
        <slot />
      </div>
      <admins-layout-footer :class="['footer', { '-full': !isShowSidebar }]" />
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
  :deep(.v-data-table-footer__pagination) > .v-btn {
    box-shadow: 0px 0px 1px 1px #999;
    border-radius: 5px;
    margin: 10px 10px;
    &:first-child {
      display: none;
    }
    &:last-child {
      display: none;
    }
  }
  :deep(.v-data-table-footer__items-per-page),
  :deep(.v-data-table-footer__info) {
    display: none;
  }
}
.footer.-full {
  width: 100%;
}
</style>
