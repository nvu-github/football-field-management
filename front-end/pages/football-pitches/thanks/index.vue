<script lang="ts" setup>
import { formatISO } from "date-fns";
import { navigateTo } from "nuxt/app";
import { useCustomerStore } from "~/stores";

definePageMeta({
  middleware: [
    function (to, from) {
      const queryString = to.fullPath.split("?")[1];
      if (!queryString) {
        return navigateTo("/football-pitches/rental");
      }
    },
  ],
});

const customerStore = useCustomerStore();
const { paramFootballPitchRental } = storeToRefs(customerStore);
const timer = ref(10);

const intervalId = setInterval(() => {
  if (timer.value === 0) {
    navigateTo("/football-pitches/histories");
    clearInterval(intervalId);
  } else {
    timer.value -= 1;
  }
}, 1000);

const route = useRoute();
const queryString = route.fullPath.split("?")[1];

customerStore
  .createCustomerFootballPitchRental({
    ...paramFootballPitchRental.value,
    rentalDate: formatISO(new Date(paramFootballPitchRental.value.rentalDate)),
  })
  .then(() => {
    customerStore.resetForm();
  })
  .catch((error) => {
    console.log(error);
    navigateTo("/");
  });
</script>
<template>
  <div class="football-pitches-thank-page">
    <v-row>
      <v-col md="12">
        <div class="content">
          <h2>Đặt sân thành công</h2>
          <v-icon class="icon">
            mdi mdi-check-circle-outline
          </v-icon>
          <p>
            Bấm <nuxt-link to="/">vào đây</nuxt-link> để quay về trang chủ <br /> hoặc
            hệ thống sẽ tự động chuyển hướng sang trang lịch sử sau
            {{ timer }} giây nữa
          </p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.football-pitches-thank-page {
  :deep(.v-col) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :deep(.content) {
    padding-top: 20px;
    width: 70%;
    height: 200px;
    background: rgb(210, 251, 228);
  }
  :deep(.v-col) {
    text-align: center;
  }
  :deep(.icon) {
    color: #24b663;
    font-size: 50px;
  }
}
</style>