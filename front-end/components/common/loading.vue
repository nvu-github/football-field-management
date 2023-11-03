<script lang="ts" setup>
import loading from "~/public/ball-triangle.svg";

import {storeToRefs} from "pinia"
import { useAppStore } from "~/stores";

const appStore = useAppStore();
const { isLoading  } = storeToRefs(appStore);
</script>
<template>
  <div class="loading text-center">
    <v-overlay :model-value="isLoading" class="align-center justify-center" :persistent="isLoading">
      <v-img :src="loading" width="100" />
    </v-overlay>
  </div>
</template>
