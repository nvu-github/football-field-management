<script lang="ts" setup>
import { parse, isSameDay, isAfter } from "date-fns";
import { storeToRefs } from "pinia";
import {
  useAppStore,
  useCustomerStore,
  useDialogStore,
  useFootballPitchPriceStore,
} from "~/stores";

definePageMeta({
  middleware: ["payment"],
});

const { $toast }: any = useNuxtApp();
const route = useRoute();
const customerStore = useCustomerStore();
const appStore = useAppStore();
const dialogStore = useDialogStore();
const footballPitchPriceStore = useFootballPitchPriceStore();
const { breadCrumbs } = storeToRefs(appStore);
const { paramFootballPitchRental } = storeToRefs(customerStore);
const { footballPitchPrices } = storeToRefs(footballPitchPriceStore);

await footballPitchPriceStore.getFootballPitchPrices();
breadCrumbs.value = [
  {
    title: "Trang chủ",
    disabled: false,
    href: "/",
  },
  {
    title: "Đặt sân",
    disabled: true,
    href: "/fooball-piches/rental",
  },
];

customerStore.resetForm();
if (route.query) {
  const { id, startTime, endTime, rentalDate } = route.query;
  const durationTime = `${startTime} - ${endTime}`;
  const leasingDuration = footballPitchPrices.value.find(
    (leasingDuration) =>
      Number(id) === leasingDuration.footballPitchId &&
      leasingDuration.leasingDurationName === durationTime
  );
  paramFootballPitchRental.value.footballPitchId = Number(id);
  paramFootballPitchRental.value.rentalDate = parse(rentalDate, 'dd/MM/yyyy', new Date());
  paramFootballPitchRental.value.leasingDurationId = leasingDuration ? Number(leasingDuration.leasingDurationId) : null;
}

async function submitRentalInfo() {
  const formValidation = validForm();

  if (!formValidation.status) {
    const errorMessage = formValidation.message
      ? `Vui lòng nhập thông tin ${formValidation.message}`
      : "Thời gian đặt sân phải lớn hơn hoặc bằng ngày hiện tại";

    return $toast.error(errorMessage);
  }

  dialogStore.showDialog(
    resolveComponent("user-football-pitch-dialog-payment")
  );
}

function validForm() {
  let message = "sân bóng";
  let status = true;
  const { footballPitchId, rentalDate, leasingDurationId } =
    paramFootballPitchRental.value;
  const currentDate = new Date();

  if (!footballPitchId) {
    status = false;
  }

  if (!rentalDate) {
    message = "thời gian đặt sân";
    status = false;
  }

  if (!leasingDurationId) {
    message = "khung giờ";
    status = false;
  }

  const validDate =
    isAfter(new Date(rentalDate), currentDate) ||
    isSameDay(new Date(rentalDate), currentDate);
  if (!validDate) {
    message = "";
    status = false;
  }

  return { status, message };
}
</script>
<template>
  <div class="football-pitches-rental-page">
    <v-form
      v-model="paramFootballPitchRental.value"
      class="form"
      @submit.prevent="submitRentalInfo"
    >
      <v-row class="row">
        <v-col
          :md="paramFootballPitchRental.footballPitchId ? 4 : 12"
          class="form"
        >
          <user-football-pitch-rental-form />
        </v-col>
        <v-col
          v-if="paramFootballPitchRental.footballPitchId"
          md="7"
          class="info"
        >
          <user-football-pitch-rental-info />
        </v-col>
        <div class="action">
          <v-btn
            class="button -success"
            type="submit"
            :disabled="!paramFootballPitchRental.value"
          >
            Đặt sân
          </v-btn>
        </div>
      </v-row>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.football-pitches-rental-page {
  > .form > .row > .info {
    margin-left: 30px;
    width: 100%;
    border-left: 1px solid #b4b2b2;
  }
  > .form > .row > .action {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 30px;
  }
  > .form > .row > .action > .button {
    width: 300px;
  }
}
</style>
