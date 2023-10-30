<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
  useDialogStore,
  usePaymentStore,
  useCustomerStore,
  useAccessoryStore,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const rules = {
  price: (value: string) => !!value || "Vui lòng nhập số tiền thanh toán",
};

const { $toast }: any = useNuxtApp();
const dialogStore = useDialogStore();
const paymentStore = usePaymentStore();
const customerStore = useCustomerStore();
const accessoryStore = useAccessoryStore();
const { accessories } = storeToRefs(accessoryStore);
const { payloadAmountPayment } = storeToRefs(paymentStore);
const { paramFootballPitchRental } = storeToRefs(customerStore);
let rentalPrice = 0;
let subRentalPrice = 0;

const formattedPrice = computed<any>({
  get: () => {
    if (payloadAmountPayment.value.amount) {
      return formatPrice(payloadAmountPayment.value.amount);
    }
    return null;
  },
  set: (value) => {
    if (value) {
      payloadAmountPayment.value.amount = parseInt(
        value.replace(/\./g, ""),
        10
      );
    } else {
      payloadAmountPayment.value.amount = null;
    }
  },
});

const { customerAccessoryRentals } = paramFootballPitchRental.value;
const accessoryTotalPrice = customerAccessoryRentals?.reduce(
  (total, accessory) => {
    const accessoryFound: any = accessories.value.find(
      (accessoryVal: any) => accessoryVal.id === accessory.accessoryId
    );
    return (total += accessoryFound.price * accessoryFound.amount);
  },
  0
);

rentalPrice =
  Number(payloadAmountPayment.value.pricePayment) + Number(accessoryTotalPrice);
subRentalPrice =
  (Number(payloadAmountPayment.value.pricePayment) +
    Number(accessoryTotalPrice)) *
  0.3;

paramFootballPitchRental.value.rentalPrice = rentalPrice;
payloadAmountPayment.value.amount = subRentalPrice;

async function confirmPayment() {
  try {
    const { amount, pricePayment } = payloadAmountPayment.value;
    const priceValue = Number(pricePayment) * 0.3;
    if (Number(amount) < priceValue) {
      return $toast.error("Số tiền thanh toán không được nhỏ hơn tiền cọc");
    }
    const paymentUrl = await paymentStore.createPaymentUrl({
      amount,
    });
    const { paymentRedirect } = paymentUrl.data;
    localStorage.setItem(
      "customerFootballPitchRental",
      JSON.stringify(paramFootballPitchRental.value)
    );
    window.location.href = paymentRedirect;
  } catch (err) {
    console.log(err);
    $toast.error("Có lỗi xảy ra trong quá trình đặt sân");
  }
}

function cancelPayment() {
  dialogStore.closeDialog();
}
</script>

<template>
  <div class="dialog-payment">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="title mb-4">
                Để đặt sân quý khách vui lòng thanh toán trước tiền thuê <br />
                hoặc thanh toán đặt cọc 30% tiền thuê
              </div>
              <div class="subtitle">
                <p class="price mb-2">
                  <b class="label">Tiền cọc: </b>
                  {{ formatPrice(subRentalPrice) }}
                  <span class="unit">VNĐ</span>
                </p>
                <p class="price mb-2">
                  <b class="label">Tổng tiền sân: </b>
                  {{ formatPrice(rentalPrice) }} <span class="unit">VNĐ</span>
                </p>
              </div>
              <v-text-field
                v-model.trim="formattedPrice"
                label="Qúy khác vui lòng nhập số tiền thanh toán (VNĐ)*"
                type="text"
                variant="underlined"
                :rules="[rules.price]"
                required
              >
                <template #append> VNĐ </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="button -default" @click="cancelPayment"> Hủy </v-btn>
        <v-btn
          class="button -success"
          :disabled="!payloadAmountPayment"
          @click="confirmPayment"
        >
          Thanh toán
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.dialog-payment {
  :deep(.v-card) {
    padding: 15px 5px 5px;
  }
  :deep(.v-card-text) {
    padding: 0;
  }
  :deep(.title) {
    font-size: 20px;
  }
  :deep(.subtitle) > .price {
    color: #e60000;
  }
  :deep(.subtitle) > .price > .label,
  :deep(.subtitle) > .price > .unit {
    color: #000;
  }
}
</style>
