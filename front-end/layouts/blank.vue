<script lang="ts" setup>
import 
import { useNuxtApp } from "nuxt/app"
const { $apis }: any = useNuxtApp();
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores";
const appStore = useAppStore();
const { isLoading } = storeToRefs(appStore);

onMounted(() => {
  $apis.interceptors.request.use((config: any) => {
    isLoading.value = true
    return config;
  });

  $apis.interceptors.response.use((response: any) => {
    isLoading.value = false
    return response;
  }, (error: any) => {
    isLoading.value = false
    return Promise.reject(error);
  });
})
</script>

<template>
  <div class="app-layout">
    <slot />
    <common-loading v-if="isLoading" />
  </div>
</template>