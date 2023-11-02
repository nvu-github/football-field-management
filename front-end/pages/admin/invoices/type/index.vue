<script lang="ts" setup>
import { resolveComponent } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useInvoiceTypeStore, useDialogStore } from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Tên loại hóa đơn", width: "70%", align: "start", key: "name" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const invoiceTypeStore = useInvoiceTypeStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { invoiceTypes } = storeToRefs(invoiceTypeStore);
app.value.title = "Quản lý loại hóa đơn";

async function openDialogCreateInvoiceType() {
  await dialogStore.showDialog(resolveComponent("admin-invoice-dialog-type"), {
    title: "Thêm",
    action: "createInvoiceType",
  });
}

async function openDialogUpdateInvoiceType(id: number | null) {
  await dialogStore.showDialog(resolveComponent("admin-invoice-dialog-type"), {
    id,
    title: "Cập nhật",
    action: "updateInvoiceType",
  });
}

function openDialogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: invoiceTypeStore,
    action: "deleteInvoiceType",
    callback: "getInvoiceTypes",
    payload: {
      id,
    },
    message: {
      success: "Xóa loại hóa đơn thành công",
      error: "Xóa loại hóa đơn thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

invoiceTypeStore.getInvoiceTypes();
</script>

<template>
  <div class="invoice-type-pages">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDialogCreateInvoiceType">
          Thêm loại hóa đơn
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="invoiceTypes">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDialogUpdateInvoiceType(item.raw.id)"
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
.invoice-type-pages {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
