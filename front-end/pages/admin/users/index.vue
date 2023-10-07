<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useUserStore, useDialogStore, statuses } from "~/stores";

const headers = [
  {
    title: "STT",
    align: "start",
    sortable: false,
    key: "Sno",
  },
  { title: "Tên người dùng", key: "name" },
  { title: "Email", key: "email" },
  { title: "Quyền", key: "role" },
  { title: "Trạng thái", key: "status" },
  { title: "Tác vụ", key: "actions", sortable: false },
];
const appStore = useAppStore();
const userStore = useUserStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { accounts } = storeToRefs(userStore);
app.value.title = "Quản lý tài khoản";
function openDiaglogUserCreate(type: string, id: string) {
  dialogStore.showDialog(resolveComponent("admins-users-dialog-user-create"), {
    type: type,
    id,
  });
}
function openDiaglogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    isDelete: false,
    id,
  });
}

userStore.getAccounts();
</script>
<template>
  <div class="user-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <button class="button" @click="openDiaglogUserCreate('create')">
          Thêm tài khoản
        </button>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="accounts">
          <template #[`item.Sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.status`]="{ item }">
            {{ statuses[item.raw.status] }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-icon
              size="small"
              class="me-2"
              @click="openDiaglogUserCreate('update', item.raw.id)"
            >
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="openDiaglogConfirm(item.raw.id)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.user-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
