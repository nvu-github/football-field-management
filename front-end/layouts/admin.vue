<script lang="ts" setup>
import { storeToRefs } from "pinia";
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
    <admin-layout-navbar />
    <admin-layout-header />
    <v-main>
      <div class="main">
        <slot />
      </div>
      <admin-layout-footer :class="['footer', { '-full': !isShowSidebar }]" />
    </v-main>
    <common-dialog />
  </v-app>
</template>

<style lang="scss" scoped>
.main {
  padding: 40px 35px;
  min-height: 600px;

  :deep(.v-input__details) {
    margin-top: 5px;
  }

  :deep(.v-data-table__th) {
    background: #f2f2f2 !important;
    border-bottom: 1px solid #b3b3b3 !important;
  }

  :deep(.v-data-table__td):last-child > .button {
    min-width: 40px;
    margin: 5px;
    padding: 0;
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

  :deep(.v-chip) > .v-chip__content {
    font-weight: bold;
  }
}
.footer.-full {
  width: 100%;
}
</style>
