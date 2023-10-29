<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useFootballPitchStore, useDialogStore } from "~/stores";
import { format } from "date-fns";
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
    width: "20%",
    align: "start",
    key: "footballPitchName",
  },
  {
    title: "Tên khách hàng",
    width: "20%",
    align: "start",
    key: "name",
  },
  {
    title: "Ngày thuê",
    width: "15%",
    align: "start",
    key: "rentalDate",
  },
  {
    title: "Khung giờ",
    width: "18%",
    align: "start",
    key: "leasingDuration",
  },
  { title: "Giá thuê", width: "15%", align: "start", key: "price" },
  {
    title: "Tác vụ",
    width: "20%",
    align: "center",
    key: "actions",
    sortable: false,
  },
];
const appStore = useAppStore();
const footballPitchStore = useFootballPitchStore();
const dialogStore = useDialogStore();
const { isDelete } = storeToRefs(dialogStore);
const { app } = storeToRefs(appStore);
const { adminConfirmCustomerRental } = storeToRefs(footballPitchStore);
app.value.title = "Quản lý đặt sân";

watch(isDelete, async () => {
  await footballPitchStore.getFootballPitches();
  isDelete.value = false;
});

async function openDiaglogFooballPitchRentalDetail(id?: string) {
  await dialogStore.showDialog(
    resolveComponent("admins-football-pitches-dialog-leasing-duration"),
    {
      id,
    }
  );
}

function openDiaglogConfirm(id: string, type?: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    id,
    type,
    endpoint: `football-pitches/confirm/${id}`,
    nameObject: "sân bóng",
  });
}

function getColorStatusFootballPitchRental(status: string) {
  let color = "success";
  switch (status) {
    case "REJECT":
      color = "primary";
      break;
    case "PENDING":
      color = "orange";
      break;
  }
  return color;
}

footballPitchStore.getAdminConfirmCustomerRental();
</script>
<template>
  <div class="football-pitch-confirm-page">
    <v-row>
      <v-col md="12">
        <v-data-table
          class="table"
          :headers="headers"
          :items="adminConfirmCustomerRental"
        >
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.rentalDate`]="{ item }">
            {{ format(new Date(item.raw.rentalDate), "dd/MM/yyyy") }}
          </template>
          <template #[`item.leasingDuration`]="{ item }">
            {{ item.raw.startTime }} - {{ item.raw.endTime }}
          </template>
          <template #[`item.price`]="{ item }">
            {{ formatPrice(item.raw.price) }} VNĐ
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -success"
              :disabled="item.raw.status !== 'PENDING'"
              @click="openDiaglogConfirm(item.raw.id, 'confirm')"
            >
              <v-icon> mdi mdi-check-bold </v-icon>
            </v-btn>
            <v-btn
              class="button -danger"
              @click="openDiaglogConfirm(item.raw.id)"
            >
              <v-icon> mdi mdi-close-circle-outline </v-icon>
            </v-btn>

            <v-btn
              class="button -warning"
              @click="openDiaglogFooballPitchRentalDetail(item.raw.id)"
            >
              <v-icon> mdi mdi-list-box </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.football-pitch-confirm-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
