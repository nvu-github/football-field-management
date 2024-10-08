<script lang="ts" setup>
import { ref } from "vue";
import { formatISO } from "date-fns";
import { navigateTo, useRoute } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useCustomerStore,
  useFootballPitchStore,
  useInvoiceStore,
  useAccessoryStore,
} from "~/stores";
import { sendMessage } from "~/services/socket";

definePageMeta({
  middleware: [
    function (to) {
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
const accessoryStore = useAccessoryStore();
const { accessories } = storeToRefs(accessoryStore);
const { payloadInvoice, invoiceCustomer } = storeToRefs(invoiceStore);
const { footballPitch } = storeToRefs(footballPitchStore);
const { payloadCustomerFootballPitchRental }: any = storeToRefs(customerStore);
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
customerStore
  .createCustomerFootballPitchRental({
    ...payloadCustomerFootballPitchRental.value,
    rentalDate: formatISO(
      new Date(payloadCustomerFootballPitchRental.value.rentalDate)
    ),
  })
  .then(async (rentalData) => {
    const { id, customerId, rentalDate } = rentalData.data;
    await accessoryStore.getAccessories();
    await invoiceStore.getInvoiceCustomerRental(+customerId, rentalDate);

    if (
      invoiceCustomer.value &&
      invoiceCustomer.value.length > 0 &&
      invoiceCustomer.value[0].invoiceFootballPitchRental
    ) {
      await updateInvoice(id);
    } else {
      await createInvoice(id);
    }

    await createNotification();
    localStorage.removeItem("paymentMethod");
    customerStore.resetForm();
  })
  .catch((error) => {
    console.log(error);
    clearInterval(intervalId);
    navigateTo("/");
  });

async function createInvoice(customerFootballPitchRentalId: number) {
  const { rentalPrice, customerAccessoryRentals } =
    payloadCustomerFootballPitchRental.value;
  const { vnp_Amount } = route.query;
  // const amountPayment = vnp_Amount;
  const amountPayment = Number(vnp_Amount) / 100;
  const moneyPaid = amountPayment;

  payloadInvoice.value = {
    totalPrice: rentalPrice,
    moneyPaid,
    status: Number(rentalPrice) === Number(moneyPaid) ? "PAID" : "DEPOSIT",
    staffId: 1,
    customerFootballIds: [customerFootballPitchRentalId],
  };

  if (customerAccessoryRentals) {
    payloadInvoice.value.invoiceDetails = customerAccessoryRentals.map(
      (customerAccessoryRental: any) => {
        const { accessoryId, amount } = customerAccessoryRental;
        const accessoryFound: any = accessories.value.find(
          ({ id }) => id === accessoryId
        );
        return {
          price: accessoryFound.price,
          amount: Number(amount),
          finalCost: accessoryFound.price * Number(amount),
          accessoryId,
        };
      }
    );
  }
  await invoiceStore.createInvoice(payloadInvoice.value);
}

async function updateInvoice(customerFootballPitchRentalId: number) {
  const { rentalPrice, customerAccessoryRentals } =
    payloadCustomerFootballPitchRental.value;
  const { vnp_Amount } = route.query;
  // const amountPayment = vnp_Amount;
  const amountPayment = Number(vnp_Amount) / 100;
  const moneyPaid = amountPayment;

  const customerFootballIds = invoiceCustomer.value.map(({ id }) => id);
  const totalPrice =
    Number(rentalPrice) +
    Number(
      invoiceCustomer.value[0].invoiceFootballPitchRental.invoice.totalPrice
    );
  const moneyPaidPayload =
    Number(moneyPaid) +
    Number(
      invoiceCustomer.value[0].invoiceFootballPitchRental.invoice.moneyPaid
    );

  payloadInvoice.value = {
    id: invoiceCustomer.value[0].invoiceFootballPitchRental.invoiceId,
    totalPrice,
    moneyPaid: moneyPaidPayload,
    customerFootballIds,
    status:
      Number(totalPrice) === Number(moneyPaidPayload) ? "PAID" : "DEPOSIT",
  };

  if (customerAccessoryRentals) {
    const accessoryRentals = customerAccessoryRentals.map(
      (customerAccessoryRental: any) => {
        const { accessoryId, amount } = customerAccessoryRental;
        const accessoryFound: any = accessories.value.find(
          ({ id }) => id === accessoryId
        );
        return {
          price: accessoryFound.price,
          amount: Number(amount),
          finalCost: accessoryFound.price * Number(amount),
          accessoryId,
        };
      }
    );

    payloadInvoice.value.invoiceDetails = mergeInvoiceDetails(
      invoiceCustomer.value[0].invoiceFootballPitchRental.invoice.invoiceDetail,
      accessoryRentals
    );
  }

  await invoiceStore.updateInvoice(payloadInvoice.value);
}

async function createNotification() {
  const { footballPitchId } = payloadCustomerFootballPitchRental.value;
  await footballPitchStore.getFootballPitch(Number(footballPitchId));
  sendMessage("notification", {
    title: "Yêu cầu đặt sân",
    content: footballPitch.value?.name,
    status: "UNREAD",
  });
}

function mergeInvoiceDetails(invoiceDetail1: any, invoiceDetail2: any) {
  const mergedArray: any[] = [];
  const mapData: any = {};

  function addToPriceMap(obj: any) {
    const { accessoryId, price, amount, finalCost, ...rest } = obj;
    if (!mapData[accessoryId]) {
      mapData[accessoryId] = { price: 0, amount: 0, finalCost: 0, ...rest };
    }

    mapData[accessoryId].price += Number(price);
    mapData[accessoryId].amount += Number(amount);
    mapData[accessoryId].finalCost += Number(finalCost);
  }

  invoiceDetail1.forEach((obj: any) => {
    addToPriceMap(obj);
  });

  invoiceDetail2.forEach((obj: any) => {
    addToPriceMap(obj);
  });

  Object.keys(mapData).forEach((id) => {
    mergedArray.push({ accessoryId: parseInt(id), ...mapData[id] });
  });

  return mergedArray;
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
  margin-top: 30px;
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
