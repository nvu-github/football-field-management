<script lang="ts" setup>
import { ref, watchEffect, resolveComponent } from "vue";
import { storeToRefs } from "pinia";
import { format } from "date-fns";
import { useAppStore, useFootballPitchStore, useDialogStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const headers = [
  {
    title: "STT",
    width: "5%",
    align: "center",
    sortable: false,
    key: "sno",
  },
  {
    title: "Tên khách hàng",
    width: "20%",
    align: "start",
    key: "customerName",
  },
  {
    title: "Sân bóng",
    width: "25%",
    align: "start",
    key: "footballPitch",
  },
  {
    title: "Ngày thuê",
    width: "15%",
    align: "start",
    key: "rentalDate",
  },
  { title: "Trạng thái", width: "15%", align: "start", key: "status" },
  {
    title: "Tác vụ",
    width: "15%",
    align: "center",
    key: "actions",
    sortable: false,
  },
];
const statusFootballPitch = [
  {
    key: "ACCEPT",
    title: "Xác nhận",
  },
  {
    key: "REJECT",
    title: "Từ chối",
  },
  {
    key: "PENDING",
    title: "Yêu cầu",
  },
];

const appStore = useAppStore();
const footballPitchStore = useFootballPitchStore();
const dialogStore = useDialogStore();
const { app, isLoading } = storeToRefs(appStore);
const { customerFootballPitchRentals } = storeToRefs(footballPitchStore);
app.value.title = "Quản lý đặt sân";
const conditionFilterFootballPitch = ref<any>({
  rentalDate: null,
  status: null,
});
const footballPitchConfirmFound = ref<any>();

const formatDatePicker = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

await footballPitchStore.getCustomerFootballPitchRentals();
watchEffect(() => {
  if (customerFootballPitchRentals) filterFootballConfirm();
});

function openDialogDetail(id: number) {
  dialogStore.showDialog(
    resolveComponent("common-football-pitch-dialog-rental-detail"),
    {
      id,
    }
  );
}

function filterFootballConfirm() {
  const { rentalDate, status } = conditionFilterFootballPitch.value;
  footballPitchConfirmFound.value = customerFootballPitchRentals.value.filter(
    (footballPitch) => {
      let condition = true;

      if (rentalDate) {
        condition =
          condition &&
          format(new Date(rentalDate), "dd/MM/yyyy") ===
            format(new Date(footballPitch.rentalDate), "dd/MM/yyyy");
      }

      if (status) {
        condition = condition && footballPitch.status === status;
      }

      return condition;
    }
  );
}

function getStatusCustomerFootballPitchRental(footballPitches: any) {
  let message = "Đã xác nhận";
  let color = "success";
  const isPending = footballPitches.some(
    (footballPitch: any) => footballPitch.status === "PENDING"
  );
  const isReject = footballPitches.every(
    (footballPitch: any) => footballPitch.status === "REJECT"
  );
  if (isPending) {
    message = "Chờ xác nhận";
    color = "orange";
  }

  if (isReject) {
    message = "Đã hủy";
    color = "error";
  }

  return {
    text: message,
    color,
  };
}
</script>
<template>
  <div class="football-pitch-confirm-page">
    <v-row class="row">
      <v-col class="col" lg="4" xs="12">
        <common-date-picker
          v-model="conditionFilterFootballPitch.rentalDate"
          class="datepicker"
          placeholder="Thời gian thuê"
          :format="formatDatePicker"
        />
      </v-col>
      <v-col lg="3" xs="12">
        <v-autocomplete
          v-model="conditionFilterFootballPitch.status"
          label="Trạng thái"
          item-value="key"
          item-title="title"
          :items="statusFootballPitch"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table
          class="table"
          :headers="headers"
          :items="footballPitchConfirmFound"
        >
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.footballPitch`]="{ item }">
            <ol class="list">
              <li
                v-for="(footballPitch, index) in item.raw.footballPitches"
                :key="index"
                class="item"
              >
                {{ footballPitch.name }}
                <p>
                  (<b
                    ><i>{{ footballPitch.leasingDuration }}</i></b
                  >)
                </p>
              </li>
            </ol>
          </template>
          <template #[`item.rentalDate`]="{ item }">
            {{ format(new Date(item.raw.rentalDate), "dd/MM/yyyy") }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              :color="
                getStatusCustomerFootballPitchRental(item.raw.footballPitches)
                  .color
              "
              >{{
                getStatusCustomerFootballPitchRental(item.raw.footballPitches)
                  .text
              }}</v-chip
            >
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDialogDetail(item.raw.id)"
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

  > .row > .col > .datepicker {
    margin-top: 15px;
  }
  > .row > .action {
    display: flex;
    align-items: center;
  }
  :deep(.dp__clear_icon) {
    display: block;
  }
  :deep(.list) {
    line-height: 2;
  }
}
</style>
