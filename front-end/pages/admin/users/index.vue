<script lang="ts" setup>
import { resolveComponent, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useUserStore, useDialogStore, statuses } from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Tên người dùng", align: "start", key: "name" },
  { title: "Email", align: "start", key: "email" },
  { title: "Quyền", align: "start", key: "role" },
  // { title: "Trạng thái", align: "start", key: "status" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const userStore = useUserStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { accounts } = storeToRefs(userStore);
app.value.title = "Quản lý tài khoản";

async function openDialogCreateUser() {
  await dialogStore.showDialog(resolveComponent("admin-user-dialog-user"), {
    title: "Thêm",
    action: "createAccount",
  });
}

async function openDialogUpdateUser(id: string) {
  await dialogStore.showDialog(resolveComponent("admin-user-dialog-user"), {
    id,
    title: "Cập nhật",
    action: "updateAccount",
  });
}

function openDialogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: userStore,
    action: "updateStatusAccount",
    callback: "getAccounts",
    payload: {
      id,
    },
    message: {
      success: "Xác nhận tài khoản thành công",
      error: "Xác nhận tài khoản thất bại",
    },
    title: "Bạn có chắc chắn muốn xác nhận",
    button: {
      text: "Xác nhận",
      class: "-primary",
    },
  });
}

function openDialogDelete(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: userStore,
    action: "deleteAccount",
    callback: "getAccounts",
    payload: {
      id,
    },
    message: {
      success: "Xóa tài khoản thành công",
      error: "Xóa tài khoản thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

function getColorStatusAccount(status: string) {
  let color = "orange";
  switch (status) {
    case "APPROVED":
      color = "green";
      break;
    case "DELETED":
      color = "red";
      break;
  }
  return color;
}

userStore.getAccounts();
</script>
<template>
  <div class="user-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDialogCreateUser">
          Thêm tài khoản
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="accounts">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              :color="getColorStatusAccount(item.raw.status)"
              text-color="black"
            >
              {{ statuses[item.raw.status] }}
            </v-chip>
          </template>
          <template #[`item.role`]="{ item }">
            {{ item.raw.roleName }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDialogUpdateUser(item.raw.id)"
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
            <!-- <v-btn
              class="button -success"
              :disabled="item.raw.status !== 'PENDING'"
              @click="openDialogConfirm(item.raw.id)"
            >
              <v-icon> mdi mdi-check-bold </v-icon>
            </v-btn> -->
            <v-btn
              class="button -danger"
              @click="openDialogDelete(item.raw.id)"
            >
              <v-icon> mdi-delete </v-icon>
            </v-btn>
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
