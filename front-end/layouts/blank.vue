<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores";

const appStore = useAppStore();
const { isLoading } = storeToRefs(appStore);

onMounted(() => appStore.setLoading());
</script>

<template>
  <div class="app-layout">
    <slot />
    <common-loading v-if="isLoading" />
  </div>
</template>
