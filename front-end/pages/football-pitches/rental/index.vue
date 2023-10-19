<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useCustomerStore } from "~/stores";

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

function submitRentalInfo() {
  console.log(paramFootballPitchRental.value);
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
        <v-col :md="4" class="form">
          <user-football-pitch-rental-form />
        </v-col>
        <v-col md="7" class="info">
          <user-football-pitch-rental-info />
        </v-col>
        <div class="action">
          <v-btn
            :disabled="!paramFootballPitchRental.value"
            class="button -success"
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
