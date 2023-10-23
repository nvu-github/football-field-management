<script lang="ts" setup>
import {useCustomerStore} from '~/stores'
const customerStore = useCustomerStore();
const { paramFootballPitchRental } = storeToRefs(customerStore);

const route = useRoute()
console.log(route.fullPath)
const queryString = route.fullPath.split('?')[1]
console.log(queryString)

// await customerStore.createCustomerFootballPitchRental({
    //   ...paramFootballPitchRental.value,
    //   rentalDate: formatISO(
    //     new Date(paramFootballPitchRental.value.rentalDate)
    //   ),
    // });
    // resetForm();
    // $toast.success("Đặt sân bóng thành công, vui lòng chờ chúng tôi xác nhận");
</script>
<template>
  <div class="football-pitches-thank-page">
    thanks
  </div>
</template>
<style lang="scss" scoped>
.football-pitches-thank-page {

}
</style>