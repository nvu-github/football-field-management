<script lang="ts" setup>
import { watch, resolveComponent } from "vue";
import { storeToRefs } from "pinia";
import {
  useAppStore,
  useFootballPitchPriceStore,
  useDialogStore,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  {
    title: "Tên sân bóng",
    width: "30%",
    align: "start",
    key: "footballPitchName",
  },
  {
    title: "Thời gian thuê",
    width: "30%",
    align: "start",
    key: "leasingDurationName",
  },
  { title: "Giá thuê", width: "20%", align: "start", key: "price" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const footballPitchPriceStore = useFootballPitchPriceStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { footballPitchPrices } = storeToRefs(footballPitchPriceStore);
app.value.title = "Quản lý giá thuê sân bóng";

async function openDiaglogCreateFootballPitchPrice() {
  await dialogStore.showDialog(
    resolveComponent("admin-football-pitch-dialog-price"),
    {
      title: "Thêm",
      action: "createFootballPitchPrice",
    }
  );
}

async function openDiaglogUpdateFootballPitchPrice(id?: string) {
  await dialogStore.showDialog(
    resolveComponent("admin-football-pitch-dialog-price"),
    {
      id,
      title: "Cập nhật",
      action: "updateFootballPitchPrice",
    }
  );
}

function openDiaglogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: footballPitchPriceStore,
    action: "deleteFootballPitchPrice",
    callback: "getFootballPitchPrices",
    payload: {
      id,
    },
    message: {
      success: "Xóa giá thuê sân thành công",
      error: "Xóa giá thuê sân thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

footballPitchPriceStore.getFootballPitchPrices();
</script>
<template>
  <div class="football-pitch-price-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn
          class="button -success"
          @click="openDiaglogCreateFootballPitchPrice"
        >
          Thêm giá thuê
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="footballPitchPrices">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.price`]="{ item }">
            {{ formatPrice(item.raw.price) }} VNĐ
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDiaglogUpdateFootballPitchPrice(item.raw.id)"
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              class="button -danger"
              @click="openDiaglogConfirm(item.raw.id)"
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
.football-pitch-price-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
