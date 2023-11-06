<script lang="ts" setup>
import { resolveComponent } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useInvoiceStore, useDialogStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  {
    title: "Tên khách hàng",
    width: "25%",
    align: "start",
    key: "customerName",
  },
  {
    title: "Loại hóa đơn",
    width: "20%",
    align: "start",
    key: "invoiceTypeName",
  },
  { title: "Trạng thái", width: "15%", align: "start", key: "status" },
  { title: "Tổng tiền", width: "15%", align: "start", key: "totalPrice" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const invoiceStore = useInvoiceStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { invoices } = storeToRefs(invoiceStore);
app.value.title = "Quản lý hóa đơn";

async function openDialogCreateInvoiceType() {
  await dialogStore.showDialog(
    resolveComponent("admin-invoice-dialog-create"),
    {
      title: "Tạo",
      action: "createInvoice",
    }
  );
}

async function openDialogUpdateInvoiceType(id: number | null) {
  await dialogStore.showDialog(
    resolveComponent("admin-invoice-dialog-create"),
    {
      id,
      title: "Cập nhật",
      action: "updateInvoice",
    }
  );
}

function openDialogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: invoiceStore,
    action: "deleteInvoice",
    callback: "getInvoices",
    payload: {
      id,
    },
    message: {
      success: "Xóa hóa đơn thành công",
      error: "Xóa hóa đơn thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

invoiceStore.getInvoices();
</script>
<template>
  <div class="invoice-pages">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDialogCreateInvoiceType">
          Tạo hóa đơn
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="invoices">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip :color="invoiceStore.getStatusInvoice(item.raw.status).color">
              {{ invoiceStore.getStatusInvoice(item.raw.status).text }}
            </v-chip>
          </template>
          <template #[`item.totalPrice`]="{ item }">
            {{ formatPrice(item.raw.totalPrice) }} VNĐ
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
.invoice-pages {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
