<script lang="ts" setup>
import { resolveComponent, watchEffect, onBeforeMount } from "vue";
import { isSameDay, isAfter } from "date-fns";
import { storeToRefs } from "pinia";
import { useRoute, useNuxtApp } from "nuxt/app";
import {
  useAppStore,
  useCustomerStore,
  useDialogStore,
  useFootballPitchPriceStore,
  useFootballPitchStore,
} from "~/stores";

definePageMeta({
  middleware: ["payment"],
});

const { $toast }: any = useNuxtApp();
const route = useRoute();
const customerStore = useCustomerStore();
const appStore = useAppStore();
const dialogStore = useDialogStore();
const footballPitchStore = useFootballPitchStore();
const footballPitchPriceStore = useFootballPitchPriceStore();
const { isLoading } = storeToRefs(appStore);
const { breadCrumbs } = storeToRefs(appStore);
const { checkFootballPitchRental } = storeToRefs(footballPitchStore);
const { payloadCustomerFootballPitchRental }: any = storeToRefs(customerStore);

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

onBeforeMount(() => {
  checkFootballPitchRental.value = {};
});

watchEffect(async () => {
  const { footballPitchId } = payloadCustomerFootballPitchRental.value;
  if (footballPitchId) {
    await footballPitchStore.getFootballPitch(
      payloadCustomerFootballPitchRental.value.footballPitchId
    );
  }
});

const { type } = route.query;

if (!type) customerStore.resetForm();

async function submitRentalInfo() {
  isLoading.value = true;
  const formValidation = validForm();

  if (!formValidation.status) {
    const errorMessage = formValidation.message
      ? `Vui lòng nhập thông tin ${formValidation.message}`
      : "Thời gian đặt sân không hợp lệ";

    isLoading.value = false;
    return $toast.error(errorMessage);
  }

  if (
    checkFootballPitchRental.value &&
    checkFootballPitchRental.value.status &&
    checkFootballPitchRental.value.status !== "REJECT"
  ) {
    isLoading.value = false;
    return $toast.warning(
      "Sân bóng và khung giờ đã có người đặt, vui lòng chọn khung giờ khác"
    );
  }

  dialogStore.showDialog(
    resolveComponent("user-football-pitch-dialog-payment")
  );
  isLoading.value = false;
}

async function handleFootballPitchLeasngDuration(id: number) {
  const { footballPitchId, rentalDate } =
    payloadCustomerFootballPitchRental.value;
  if (footballPitchId && id) {
    await footballPitchStore.checkCustomerFootballPitchRental({
      footballPitchId,
      footballPitchLeasingDurationId: id,
      rentalDate,
    });
  }
}

function validForm() {
  let message = "sân bóng";
  let status = true;
  const { footballPitchId, rentalDate, leasingDurationId }: any =
    payloadCustomerFootballPitchRental.value;
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

footballPitchStore.getFootballPitches();
</script>
<template>
  <div class="football-pitches-rental-page">
    <v-form
      v-model="payloadCustomerFootballPitchRental.value"
      class="form"
      @submit.prevent="submitRentalInfo"
    >
      <v-row class="row">
        <v-col
          :md="payloadCustomerFootballPitchRental.footballPitchId ? 3 : 12"
          class="form"
        >
          <user-football-pitch-rental-form />
        </v-col>
        <v-col
          v-if="payloadCustomerFootballPitchRental.footballPitchId"
          md="8"
          class="info"
        >
          <user-football-pitch-rental-info
            @football-pitch-leasing-duration-id="
              handleFootballPitchLeasngDuration
            "
          />
        </v-col>
        <div class="action">
          <v-btn
            class="button -success"
            type="submit"
            :loading="isLoading"
            :disabled="!payloadCustomerFootballPitchRental.value"
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
  margin-top: 10px;
  > .form > .row > .info {
    margin-left: 30px;
    width: 100%;
    border-left: 1px solid #b4b2b2;
  }
  > .form > .row > .action {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 30px 0;
  }
  > .form > .row > .action > .button {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .football-pitches-rental-page {
    > .form > .row > .info {
      margin-left: 0;
      width: 100%;
      border-top: 1px solid #b4b2b2;
      border-left: 0;
    }
  }
}
</style>
