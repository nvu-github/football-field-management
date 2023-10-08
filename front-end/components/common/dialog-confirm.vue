<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useDialogStore, useAppStore, useUserStore } from "~/stores";

const appStore = useAppStore();
const userStore = useUserStore();
const dialogStore = useDialogStore();
const { isDelete } = storeToRefs(dialogStore);
const { $toast }: any = useNuxtApp();
const { data }: any = dialogStore.dialog;

async function confirmDelete() {
  try {
    await appStore.deleteApi(data.endpoint);
    $toast.success(`Xóa ${data.nameObject} thành công`);
    isDelete.value = true;
  } catch (e) {
    console.log(e);
    $toast.success(`Xóa ${data.nameObject} thất bại`);
  }
  dialogStore.closeDialog();
}

async function confirmAccept() {
  try {
    await userStore.acceptAccount(data.id, "APPROVED");
    $toast.success(`Xác nhận tài khoản thành công`);
    isDelete.value = true;
  } catch (e) {
    console.log(e);
    $toast.error(`Xác nhận thất bại`);
  }
  dialogStore.closeDialog();
}
function closeDialogUserCreate() {
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
              <h1 v-if="data.type === 'confirm'">
                Bạn có chắc chắn muốn xác nhận tài khoản?
              </h1>
              <h1 v-else>Bạn có chắc chắn muốn xóa?</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="button -default" @click="closeDialogUserCreate">
          Hủy
        </v-btn>
        <v-btn
          v-if="data.type === 'confirm'"
          class="button -primary"
          @click="confirmAccept"
        >
          Xác nhận
        </v-btn>
        <v-btn v-else class="button -danger" @click="confirmDelete">
          Xóa
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
