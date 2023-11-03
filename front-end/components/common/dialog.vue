<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useDialogStore } from "~/stores";
const dialogStore = useDialogStore();
const { dialog } = storeToRefs(dialogStore);
</script>
<template>
  <v-dialog
    v-model="dialog.isVisible"
    width="100%"
    :persistent="dialog.isPersistent"
    scrollable
  >
    <div
      v-if="typeof dialog.content === 'string'"
      class="content"
      v-html="dialog.content"
    />
    <component :is="dialog.content" v-else />
  </v-dialog>
</template>
