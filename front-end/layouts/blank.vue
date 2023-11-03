<script lang="ts" setup>
import { onMounted } from "vue";
import { useAppStore } from "~/stores";

const appStore = useAppStore();
onMounted(() => appStore.setLoading());
</script>

<template>
  <div class="app-layout">
    <slot />
    <common-loading />
  </div>
</template>
