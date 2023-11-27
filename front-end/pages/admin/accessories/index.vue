<script lang="ts" setup>
import { resolveComponent } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useAccessoryStore, useDialogStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const headers = [
  {
    title: "STT",
    width: "5%",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Tên phụ kiện", width: "25%", align: "start", key: "name" },
  { title: "Số lượng", width: "15%", align: "center", key: "amount" },
  { title: "Giá thuê", width: "18%", align: "center", key: "price" },
  {
    title: "Loại phụ kiện",
    width: "15%",
    align: "start",
    key: "accessoryTypeName",
  },
  {
    title: "Tác vụ",
    width: "15%",
    align: "center",
    key: "actions",
    sortable: false,
  },
];
const appStore = useAppStore();
const accessoryStore = useAccessoryStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { accessories } = storeToRefs(accessoryStore);
app.value.title = "Quản lý phụ kiện";

async function openDialogCreateAccessory() {
  await dialogStore.showDialog(
    resolveComponent("admin-accessory-dialog-accessory"),
    {
      title: "Thêm",
      action: "createAccessory",
    }
  );
}

async function openDialogUpadteAccessory(id: string) {
  await dialogStore.showDialog(
    resolveComponent("admin-accessory-dialog-accessory"),
    {
      id,
      title: "Cập nhật",
      action: "updateAccessory",
    }
  );
}

function openDialogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: accessoryStore,
    action: "deleteAccessory",
    callback: "getAccessories",
    payload: {
      id,
    },
    message: {
      success: "Xóa phụ kiện thành công",
      error: "Xóa phụ kiện thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

accessoryStore.getAccessories();
</script>
<template>
  <div class="accessory-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDialogCreateAccessory">
          Thêm phụ kiện
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="accessories">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.price`]="{ item }">
            {{ formatPrice(item.raw.price) }} ₫
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDialogUpadteAccessory(item.raw.id)"
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
.accessory-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
