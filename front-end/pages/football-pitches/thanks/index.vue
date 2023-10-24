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

const route = useRoute();
console.log(route.fullPath);
const queryString = route.fullPath.split("?")[1];
console.log(queryString);

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
// $toast.success("Đặt sân bóng thành công, vui lòng chờ chúng tôi xác nhận");
</script>
<template>
  <div class="football-pitches-thank-page">thanks</div>
</template>
<style lang="scss" scoped>
.football-pitches-thank-page {
}
</style>