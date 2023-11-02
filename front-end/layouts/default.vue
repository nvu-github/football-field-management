<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores";
import { useHead, useNuxtApp } from "nuxt/app"

const { $apis }: any = useNuxtApp();
const appStore = useAppStore();
const { breadCrumbs, isLoading } = storeToRefs(appStore);

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
  <v-app class="layout-default">
    <div class="layout-header">
      <v-container>
        <user-layout-header class="header" />
      </v-container>
    </div>
    <div class="layout-toolbar">
      <v-container>
        <user-layout-toolbar class="toolbar" />
      </v-container>
    </div>
    <div class="main">
      <v-container>
        <v-breadcrumbs
          v-if="breadCrumbs && breadCrumbs.length > 0"
          :items="breadCrumbs"
        />
        <slot />
      </v-container>
    </div>
    <div class="layout-footer">
      <v-container>
        <user-layout-footer class="footer" />
      </v-container>
    </div>
    <common-dialog />
    <common-loading v-if="isLoading" />
  </v-app>
</template>
<style lang="scss" scoped>
.layout-default {
  :deep(.v-application__wrap) > .header {
    border-top: 2px solid #a9ca31;
  }
}

.layout-header {
  border-top: 3px solid #a9ca31;
  > .v-container > .header {
    margin: 0 auto;
  }
}

.layout-toolbar {
  background-color: #a9ca31;
  > .v-container
    > .toolbar
    > :deep(.app-header)
    > .v-toolbar__content
    > .v-toolbar {
    background-color: #a9ca31 !important;
  }
}

.main {
  padding: 10px 20px;
  min-height: 600px;
  :deep(.v-breadcrumbs) {
    padding-bottom: 0;
  }
}

.layout-footer {
  background-color: #a9ca31;
  > .v-container {
    padding: 0 !important;
  }

  > .v-container > .footer {
    padding: 10px 20px 5px;
    width: 100%;
  }
}
</style>
