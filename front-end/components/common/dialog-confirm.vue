<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useNuxtApp } from "nuxt/app";
import { useDialogStore} from "~/stores";

const dialogStore = useDialogStore();
const { isDelete } = storeToRefs(dialogStore);
const { $toast }: any = useNuxtApp();
const { data }: any = dialogStore.dialog;

async function confirm() {
  const { store, payload } = data
  const { success, error }: any = data.message
  try {
    await store[data.callback](payload);
    $toast.success(success);
    isDelete.value = true;
  } catch (e) {
    console.log(e);
    $toast.success(error);
  }
  dialogStore.closeDialog();
}

// async function confirmAccept() {
//   try {
//     await userStore.acceptAccount(data.id, "APPROVED");
//     $toast.success(`Xác nhận tài khoản thành công`);
//     isDelete.value = true;
//   } catch (e) {
//     console.log(e);
//     $toast.error(`Xác nhận thất bại`);
//   }
//   dialogStore.closeDialog();
// }
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
        <v-btn class="button -default" @click="closeDialog">
          Hủy
        </v-btn>
        <v-btn
          :class="`button ${data.button.class}`"
          @click="confirm"
        >
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
