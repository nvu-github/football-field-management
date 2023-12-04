<script lang="ts" setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { navigateTo, useNuxtApp } from "nuxt/app";
import {
  useDialogStore,
  usePaymentStore,
  useCustomerStore,
  useAccessoryStore,
  useAppStore,
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
const appStore = useAppStore();
const { isLoading } = storeToRefs(appStore);
const { accessories } = storeToRefs(accessoryStore);
const { payloadAmountPayment } = storeToRefs(paymentStore);
const { payloadCustomerFootballPitchRental } = storeToRefs(customerStore);
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

const { customerAccessoryRentals } = payloadCustomerFootballPitchRental.value;
const accessoryTotalPrice = customerAccessoryRentals?.reduce(
  (total, accessory) => {
    const accessoryFound: any = accessories.value.find(
      (accessoryVal: any) => accessoryVal.id === accessory.accessoryId
    );
    return (total += accessoryFound.price * accessory.amount);
  },
  0
);

rentalPrice =
  Number(payloadAmountPayment.value.pricePayment) + Number(accessoryTotalPrice);
subRentalPrice =
  (Number(payloadAmountPayment.value.pricePayment) +
    Number(accessoryTotalPrice)) *
  0.3;

payloadCustomerFootballPitchRental.value.rentalPrice = rentalPrice;
payloadAmountPayment.value.amount = subRentalPrice;

async function confirmPayment() {
  try {
    const { amount } = payloadAmountPayment.value;
    if (Number(amount) < subRentalPrice) {
      return $toast.warning(
        "Số tiền thanh toán không được nhỏ hơn tiền cọc. Qúy khách vui lòng nhập lại"
      );
    }
    const paymentUrl = await paymentStore.createPaymentUrl({
      amount,
    });
    const { paymentRedirect } = paymentUrl.data;
    localStorage.setItem(
      "customerFootballPitchRental",
      JSON.stringify(payloadCustomerFootballPitchRental.value)
    );
    localStorage.setItem(
      "paymentMethod",
      JSON.stringify({
        status: "rental",
      })
    );
    console.log(paymentRedirect);
    // navigateTo(`/football-pitches/rental?vnp_Amount=${amount}`);
    window.location.href = paymentRedirect;
  } catch (err) {
    console.log(err);
    $toast.error("Có lỗi xảy ra trong quá trình đặt sân");
  }
  cancelPayment();
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
                hoặc thanh toán đặt cọc 30% tổng tiền thuê
              </div>
              <div class="subtitle">
                <p class="price mb-2">
                  <b class="label">Tiền cọc: </b>
                  {{ formatPrice(subRentalPrice) }}
                  <span class="unit">₫</span>
                </p>
                <p class="price mb-2">
                  <b class="label">Tổng tiền thuê: </b>
                  {{ formatPrice(rentalPrice) }} <span class="unit">₫</span>
                </p>
              </div>
              <v-text-field
                v-model.trim="formattedPrice"
                label="Qúy khác vui lòng nhập số tiền thanh toán (₫)*"
                type="text"
                variant="underlined"
                :rules="[rules.price]"
                required
              >
                <template #append> ₫ </template>
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
          :loading="isLoading"
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
