<script lang="ts" setup>
import { useNuxtApp } from "nuxt/app";
import { useDialogStore } from "~/stores";

const dialogStore = useDialogStore();
const { $toast }: any = useNuxtApp();
const { data }: any = dialogStore.dialog;

async function confirm() {
  const { store, payload } = data;
  const { success, error }: any = data.message;
  try {
    await store[data.action](payload);
    $toast.success(success);
    if (data.callback) await store[data.callback]();
  } catch (e) {
    console.log(e);
    $toast.error(error);
  }
  dialogStore.closeDialog();
}

function closeDialog() {
  dialogStore.closeDialog();
}
</script>
<template>
  <div class="dialog-confirm">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <h1>{{ data.title }}</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="button -default" @click="closeDialog"> Hủy </v-btn>
        <v-btn :class="`button ${data.button.class}`" @click="confirm">
          {{ data.button.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.dialog-confirm {
  :deep(.v-card) {
    padding: 5px;
  }
}
</style>
