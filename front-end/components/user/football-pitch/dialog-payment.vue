<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useDialogStore, usePaymentStore, useCustomerStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const rules = {
  price: (value: string) => !!value || "Vui lòng nhập số tiền thanh toán",
};

const { $toast }: any = useNuxtApp();
const dialogStore = useDialogStore();
const paymentStore = usePaymentStore();
const customerStore = useCustomerStore();
const { payloadAmountPayment } = storeToRefs(paymentStore);


const formattedPrice = computed<any>({
  get: () => {
    if (payloadAmountPayment.value.amount) {
      return formatPrice(payloadAmountPayment.value.amount);
    }
    return null;
  },
  set: (value) => {
    if (value) {
      payloadAmountPayment.value.amount = parseInt(value.replace(/\./g, ""), 10);
    } else {
      payloadAmountPayment.value.amount = null
    }
  },
});

payloadAmountPayment.value.amount = Number(payloadAmountPayment.value.pricePayment) * 0.3 || null

async function confirmPayment() {
  try {
    const {amount, pricePayment} = payloadAmountPayment.value
    const priceValue = Number(pricePayment) * 0.3 
    if (Number(amount) < priceValue) {
      return $toast.error('Số tiền thanh toán không được nhỏ hơn tiền cọc')
    }
    const paymentUrl = await paymentStore.createPaymentUrl({
      amount,
    });
    const { paymentRedirect } = paymentUrl.data;
    window.location.href = paymentRedirect;
    customerStore.resetForm();
  } catch (err) {
    console.log(err);
    $toast.error("Đặt sân bóng thất bại");
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
              <p>
                Để đặt sân quý khác vui lòng thanh toán trước tiền thuê hoặc
                thanh toán đặt cọc 30% tiền thuê
              </p>
              <v-text-field
                v-model.trim="formattedPrice"
                label="Qúy khác vui lòng nhập số tiền thanh toán (VNĐ)*"
                type="text"
                variant="underlined"
                :rules="[rules.price]"
                required
              ></v-text-field>
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
    padding: 5px;
  }
}
</style>