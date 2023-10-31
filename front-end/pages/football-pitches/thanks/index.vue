<script lang="ts" setup>
import { ref } from "vue"
import { formatISO } from "date-fns";
import { navigateTo, useRoute } from "nuxt/app";
import {
  useCustomerStore,
  useFootballPitchStore,
  useInvoiceStore,
} from "~/stores";
import { sendMessage } from "~/services/socket";
import { storeToRefs } from "pinia";

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
const footballPitchStore = useFootballPitchStore();
const invoiceStore = useInvoiceStore();
const { footballPitch } = storeToRefs(footballPitchStore);
const { paramFootballPitchRental } = storeToRefs(customerStore);
const timer = ref(10);
const payloadInvoice = ref<Invoice>();

const intervalId = setInterval(() => {
  if (timer.value === 0) {
    navigateTo("/football-pitches/histories");
    clearInterval(intervalId);
  } else {
    timer.value -= 1;
  }
}, 1000);

const route = useRoute();
customerStore
  .createCustomerFootballPitchRental({
    ...paramFootballPitchRental.value,
    rentalDate: formatISO(new Date(paramFootballPitchRental.value.rentalDate)),
  })
  .then(async (rentalData) => {
    const { id } = rentalData.data;
    await createInvoice(id);
    await createNotification();
    customerStore.resetForm();
  })
  .catch((error) => {
    console.log(error);
    clearInterval(intervalId);
    navigateTo("/");
  });

async function createInvoice(customerFootballPitchRentalId: number) {
  const { rentalPrice } = paramFootballPitchRental.value;
  const { vnp_Amount } = route.query;
  const moneyPaid = Number(vnp_Amount) / 100;
  payloadInvoice.value = {
    totalPrice: rentalPrice,
    moneyPaid,
    status: "DEPOSIT",
    staffId: 1,
    invoiceTypeId: 1,
    customerFootballId: customerFootballPitchRentalId,
  };
  await invoiceStore.createInvoice(payloadInvoice.value);
}

async function createNotification() {
  const { footballPitchId } = paramFootballPitchRental.value;
  await footballPitchStore.getFootballPitch(Number(footballPitchId));
  sendMessage("notification", {
    title: "Yêu cầu đặt sân",
    content: footballPitch.value?.name,
    status: "UNREAD",
  });
}
</script>
<template>
  <div class="football-pitches-thank-page">
    <v-row>
      <v-col md="12">
        <div class="content">
          <h2>Đặt sân thành công</h2>
          <v-icon class="icon"> mdi mdi-check-circle-outline </v-icon>
          <p>
            Bấm <nuxt-link to="/">vào đây</nuxt-link> để quay về trang chủ
            <br />
            hoặc hệ thống sẽ tự động chuyển hướng sang trang lịch sử sau
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
