<script lang="ts" setup>
import { useDialogStore } from "~/stores";

const dialogStore = useDialogStore();
const { url }: any = dialogStore.dialog.data;

function closeDetail() {
  dialogStore.closeDialog();
}
</script>
<template>
  <div class="dialog-image-album">
    <v-card>
      <v-icon class="close" @click="closeDetail">mdi mdi-close-thick</v-icon>
      <v-img :src="url" />
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.dialog-image-album {
  position: relative;
  width: 800px;
  > .v-card {
    padding: 10px;
  }
  > .v-card > .v-icon {
    position: absolute;
    padding: 20px;
    background: #a09f9f;
    z-index: 1;
    right: 10px;
    cursor: pointer;
    color: #fff;
  }
}
</style>
