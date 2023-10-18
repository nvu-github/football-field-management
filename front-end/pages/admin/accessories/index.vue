<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useAccessoryStore, useDialogStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Tên phụ kiện", width: "30%", align: "start", key: "name" },
  { title: "Mô tả", width: "25%", align: "start", key: "description" },
  { title: "Số lượng", width: "10%", align: "center", key: "amount" },
  { title: "Giá thuê", width: "18%", align: "center", key: "price" },
  { title: "Loại phụ kiện", width: "15%", align: "center", key: "type" },
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
const { isDelete } = storeToRefs(dialogStore);
const { app } = storeToRefs(appStore);
const { accessories } = storeToRefs(accessoryStore);
app.value.title = "Quản lý phụ kiện";

watch(isDelete, async () => {
  await accessoryStore.getAccessories();
  isDelete.value = false;
});

async function openDialogAccessory(type?: string, id?: string) {
  await dialogStore.showDialog(
    resolveComponent("admins-accessories-dialog-accessory"),
    {
      type: type,
      id,
    }
  );
}

function openDialogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    id,
    endpoint: `accessories/${id}`,
    nameObject: "phụ kiện",
  });
}

accessoryStore.getAccessories();
</script>
<template>
  <div class="accessory-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDialogAccessory">
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
          <template #[`item.description`]="{ item }">
            <span v-html="item.raw.description"></span>
          </template>
          <template #[`item.price`]="{ item }">
            {{ formatPrice(item.raw.price) }} VNĐ
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDialogAccessory('update', item.raw.id)"
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
