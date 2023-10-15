<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useFootballPitchStore, useDialogStore } from "~/stores";

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
    key: "footballPitchname",
  },
  {
    title: "Tên khách hàng",
    width: "25%",
    align: "start",
    key: "customerName",
  },
  {
    title: "Thời gian thuê",
    width: "15%",
    align: "start",
    key: "dateRental",
  },
  { title: "Giá thuê", width: "15%", align: "start", key: "price" },
  {
    title: "Tác vụ",
    width: "15%",
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
const { footballPitchRentals } = storeToRefs(footballPitchStore);
app.value.title = "Quản lý đặt sân";

watch(isDelete, async () => {
  await footballPitchStore.getFootballPitches();
  isDelete.value = false;
});

async function openDiaglogFooballPitchRental(id?: string) {
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

footballPitchStore.getFootballPitchRental();
</script>
<template>
  <div class="football-pitch-confirm-page">
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="footballPitchRentals">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.description`]="{ item }">
            <span v-html="item.raw.description"></span>
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              class="ma-2"
              :color="getColorStatusFootballPitchRental(item.raw.status)"
              text-color="white"
            >
              {{ footballPitchStore.getStatusFootballPitch(item.raw.status) }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDiaglogFooballPitchRental(item.raw.id)"
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
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
              <v-icon> mdi-delete </v-icon>
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
