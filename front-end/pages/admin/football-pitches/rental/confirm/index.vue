<script lang="ts" setup>
import { ref, watch, resolveComponent, onBeforeMount } from "vue";
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
  { title: "Trạng thái", width: "15%", align: "start", key: "status" },
  {
    title: "Tác vụ",
    width: "20%",
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
const { isConfirm } = storeToRefs(dialogStore);
const { app, isLoading } = storeToRefs(appStore);
const { customerFootballPitchRentals } = storeToRefs(footballPitchStore);
app.value.title = "Quản lý đặt sân";
const conditionFilterFootballPitch = ref<any>({
  rentalDate: new Date(),
  status: null,
});
const footballPitchConfirmFound = ref<any>();
watch(isConfirm, async () => {
  await filterFootballConfirm();
  isConfirm.value = false;
});

const formatDatePicker = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

onBeforeMount(async () => {
  await filterFootballConfirm();
});

function openDialogConfirm(id: number, status: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: footballPitchStore,
    callback: "updateStatusFootballPitchRental",
    payload: {
      id,
      status,
    },
    message: {
      success: "Xác nhận đặt sân thành công",
      error: "Xác nhận đặt sân thất bại",
    },
    title: "Bạn có chắc chắn muốn xác nhận?",
    button: {
      text: "Xác nhận",
      class: "-primary",
    },
  });
}

function openDialogReject(id: number, status: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: footballPitchStore,
    callback: "updateStatusFootballPitchRental",
    payload: {
      id,
      status,
    },
    name: "đặt sân",
    message: {
      success: "Hủy đặt sân thành công",
      error: "Hủy đặt sân thất bại",
    },
    title: "Bạn có chắc chắn muốn hủy đặt sân?",
    button: {
      text: "Xác nhận",
      class: "-danger",
    },
  });
}

function openDialogDetail(id: number) {
  dialogStore.showDialog(
    resolveComponent("common-football-pitch-dialog-rental-detail"),
    {
      id,
    }
  );
}

async function filterFootballConfirm() {
  isLoading.value = true;
  const { rentalDate, leasingDuration, status } =
    conditionFilterFootballPitch.value;
  await footballPitchStore.getAdminConfirmCustomerRental();
  if (rentalDate || leasingDuration || status) {
    footballPitchConfirmFound.value = customerFootballPitchRentals.value.filter(
      (footballPitch) => {
        let condition = true;

        if (rentalDate) {
          condition =
            condition &&
            format(new Date(rentalDate), "dd/MM/yyyy") ===
              format(new Date(footballPitch.rentalDate), "dd/MM/yyyy");
        }

        if (leasingDuration) {
          const footballLeasingDuration = `${footballPitch.startTime} - ${footballPitch.endTime}`;
          condition = condition && footballLeasingDuration === leasingDuration;
        }

        if (status) {
          condition = condition && footballPitch.status === status;
        }

        return condition;
      }
    );
  }
  isLoading.value = false;
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
      <v-col class="action" md="lg" xs="12">
        <v-btn
          class="button -success"
          :loading="isLoading"
          @click="filterFootballConfirm"
        >
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Tìm kiếm
        </v-btn>
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
          <template #[`item.rentalDate`]="{ item }">
            {{ format(new Date(item.raw.rentalDate), "dd/MM/yyyy") }}
          </template>
          <template #[`item.leasingDuration`]="{ item }">
            {{ item.raw.startTime }} - {{ item.raw.endTime }}
          </template>
          <template #[`item.price`]="{ item }">
            {{ formatPrice(item.raw.price) }} VNĐ
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              :color="
                footballPitchStore.getStatusCustomerFootballPitchRental(
                  item.raw.status
                ).color
              "
              >{{
                footballPitchStore.getStatusCustomerFootballPitchRental(
                  item.raw.status
                ).text
              }}</v-chip
            >
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -success"
              :disabled="item.raw.status !== 'PENDING'"
              @click="openDialogConfirm(item.raw.id, 'ACCEPT')"
            >
              <v-icon> mdi mdi-check-bold </v-icon>
            </v-btn>
            <v-btn
              class="button -danger"
              :disabled="item.raw.status === 'REJECT'"
              @click="openDialogReject(item.raw.id, 'REJECT')"
            >
              <v-icon> mdi mdi-close-circle-outline </v-icon>
            </v-btn>

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
}
</style>
