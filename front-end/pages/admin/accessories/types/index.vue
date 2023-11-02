<script lang="ts" setup>
import { resolveComponent } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useAccessoryTypeStore, useDialogStore } from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Tên loại phụ kiện", width: "70%", align: "start", key: "name" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const accessoryTypeStore = useAccessoryTypeStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { accessoryTypes } = storeToRefs(accessoryTypeStore);
app.value.title = "Quản lý loại phụ kiện";

async function openDialogCreateAccessoryType() {
  await dialogStore.showDialog(
    resolveComponent("admin-accessory-dialog-type"),
    {
      title: "Thêm",
      action: "createAccessoryType",
    }
  );
}

async function openDialogUpdateAccessoryType(id: string) {
  await dialogStore.showDialog(
    resolveComponent("admin-accessory-dialog-type"),
    {
      id,
      title: "Cập nhật",
      action: "updateAccessoryType",
    }
  );
}

function openDialogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: accessoryTypeStore,
    action: "deleteAccessoryType",
    callback: "getAccessoryTypes",
    payload: {
      id,
    },
    message: {
      success: "Xóa loại phụ kiện thành công",
      error: "Xóa loại phụ kiện thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

accessoryTypeStore.getAccessoryTypes();
</script>
<template>
  <div class="accessory-type-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDialogCreateAccessoryType">
          Thêm loại phụ kiện
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="accessoryTypes">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDialogUpdateAccessoryType(item.raw.id)"
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              class="button -danger"
              @click="openDialogConfirm(item.raw.id)"
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
.accessory-type-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
