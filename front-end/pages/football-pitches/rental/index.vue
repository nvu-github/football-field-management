<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useCustomerStore, useDialogStore } from "~/stores";

definePageMeta({
  middleware: ["payment"],
});

const { $toast }: any = useNuxtApp();
const route = useRoute();
const customerStore = useCustomerStore();
const appStore = useAppStore();
const dialogStore = useDialogStore();
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

customerStore.resetForm();
if (route.query && route.query.id) {
  paramFootballPitchRental.value.footballPitchId = Number(route.query.id);
}

async function submitRentalInfo() {
  if (!validForm()) {
    return $toast.error("Vui lòng nhập đầy đủ thông tin sân bóng");
  }
  dialogStore.showDialog(
    resolveComponent("user-football-pitch-dialog-payment")
  );
}

function validForm(): boolean {
  const { footballPitchId, rentalDate, leasingDurationId } =
    paramFootballPitchRental.value;
  if (!footballPitchId || !rentalDate || !leasingDurationId) {
    return false;
  }
  return true;
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
