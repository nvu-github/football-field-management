<script lang="ts" setup>
import { formatISO } from "date-fns";
import { storeToRefs } from "pinia";
import { useAppStore, usePaymentStore, useCustomerStore } from "~/stores";

const route = useRoute();
const { $toast }: any = useNuxtApp();
const customerStore = useCustomerStore();
const appStore = useAppStore();
const { breadCrumbs } = storeToRefs(appStore);
const { paramFootballPitchRental } = storeToRefs(customerStore);
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

resetForm();
if (route.query && route.query.id) {
  paramFootballPitchRental.value.footballPitchId = Number(route.query.id);
}

async function submitRentalInfo() {
  usePaymentStore().createPaymentUrl({
    amount: 10000,
    bankCode: "NCB",
  });
  // try {
  //   await customerStore.createCustomerFootballPitchRental({
  //     ...paramFootballPitchRental.value,
  //     rentalDate: formatISO(
  //       new Date(paramFootballPitchRental.value.rentalDate)
  //     ),
  //   });
  //   resetForm();
  //   $toast.success("Đặt sân bóng thành công, vui lòng chờ chúng tôi xác nhận");
  // } catch (err) {
  //   console.log(err);
  //   $toast.error("Đặt sân bóng thất bại");
  // }
}

function resetForm() {
  paramFootballPitchRental.value = {
    footballPitchId: null,
    rentalDate: null,
    leasingDurationId: null,
    customerAccessoryRentals: [],
    note: "",
  };
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
          <!-- :disabled="!paramFootballPitchRental.value" -->
          <v-btn class="button -success" type="submit"> Đặt sân </v-btn>
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
