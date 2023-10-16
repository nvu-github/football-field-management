<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores";
const appStore = useAppStore();
const { breadCrumbs } = storeToRefs(appStore);
breadCrumbs.value = [];
</script>
<template>
  <div class="home-page">
    <h1 class="h1">this is my home</h1>
  </div>
</template>
<style lang="scss" scoped>
.home-page {
  > .h1 {
    font-size: 20px;
  }
}
</style>
