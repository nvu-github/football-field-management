<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import {
  useCustomerStore,
  useFootballPitchStore,
  useFootballPitchPriceStore,
  useAuthStore,
  usePaymentStore,
} from "~/stores";

const customerStore = useCustomerStore();
const footballPitchStore = useFootballPitchStore();
const footballPitchPriceStore = useFootballPitchPriceStore();
const paymentStore = usePaymentStore();
const authStore = useAuthStore();
const { footballPitchPrices } = storeToRefs(footballPitchPriceStore);
const { footballPitch, customerFootballPitchRentals } =
  storeToRefs(footballPitchStore);
const { payloadCustomerFootballPitchRental }: any = storeToRefs(customerStore);
const { payloadAmountPayment } = storeToRefs(paymentStore);
const { user }: any = storeToRefs(authStore);
const footballPitchPriceFound: any = ref<Object>({});
const emit = defineEmits(["footballPitchLeasingDurationId"]);
const sizeColumnWithImage = 12;
const sizeColumnNotImage = 6;

watchEffect(async () => {
  const { footballPitchId, leasingDurationId } =
    payloadCustomerFootballPitchRental.value;

  if (leasingDurationId) {
    const leasingDurationRentalId = footballPitchPrices.value.find(
      (footballPitchPrice) => footballPitchPrice.id === leasingDurationId
    );
    footballPitchPriceFound.value = footballPitchPrices.value.find(
      (footballPitchPrice) =>
        footballPitchPrice.leasingDurationId ===
          leasingDurationRentalId?.leasingDurationId &&
        footballPitchPrice.footballPitchId === footballPitchId
    );
    emit("footballPitchLeasingDurationId", footballPitchPriceFound.value.id);
    payloadAmountPayment.value.pricePayment =
      footballPitchPriceFound.value.price;
  }
});

function getStatusCustomerFootballPitchRental(status: string | null) {
  let color = "primary";
  let text = "Trống";

  if (status && status !== "REJECT") {
    color = "red";
    text = "Đã có người đặt";
  }

  return { color, text };
}
</script>
<template>
  <div class="rental-info">
    <div class="title">Thông tin đặt sân</div>
    <div class="content">
      <div class="fooballpitch">
        <v-row class="row">
          <v-col
            v-if="footballPitch && footballPitch.images.length > 0"
            class="col"
            md="6"
          >
            <common-carousel class="carousel" :images="footballPitch.images" />
          </v-col>
          <v-col
            class="col"
            :md="
              footballPitch && footballPitch.images.length > 0
                ? sizeColumnNotImage
                : sizeColumnWithImage
            "
          >
            <p class="name field">
              <b class="label">Tên sân bóng:</b>
              {{ footballPitch ? footballPitch.name : "" }}
            </p>
            <p class="description field">
              <b class="label">Mô tả: </b>
              <span
                v-if="footballPitch"
                class="ml-2"
                v-html="footballPitch.description"
              />
            </p>
            <p class="duration field">
              <b class="label">Khung giờ thuê: </b
              >{{
                footballPitchPriceFound &&
                footballPitchPriceFound.leasingDurationName
                  ? footballPitchPriceFound.leasingDurationName
                  : ""
              }}
            </p>
            <p class="status field">
              <b class="label">Trạng thái: </b>
              <v-chip
                v-if="footballPitchPriceFound && footballPitchPriceFound.id"
                :color="
                  getStatusCustomerFootballPitchRental(
                    customerFootballPitchRentals &&
                      customerFootballPitchRentals.length > 0
                      ? customerFootballPitchRentals[0].status
                      : null
                  ).color
                "
                >{{
                  getStatusCustomerFootballPitchRental(
                    customerFootballPitchRentals &&
                      customerFootballPitchRentals.length > 0
                      ? customerFootballPitchRentals[0].status
                      : null
                  ).text
                }}</v-chip
              >
            </p>
            <p class="date field">
              <b class="label">Ngày thuê: </b>
              {{
                payloadCustomerFootballPitchRental &&
                payloadCustomerFootballPitchRental.rentalDate
                  ? format(
                      new Date(payloadCustomerFootballPitchRental.rentalDate),
                      "dd/MM/yyyy"
                    )
                  : ""
              }}
            </p>
            <p class="price field">
              <b class="label">Giá thuê: </b>
              {{
                footballPitchPriceFound &&
                footballPitchPriceFound.price !== undefined
                  ? `${formatPrice(footballPitchPriceFound.price)} VNĐ`
                  : ""
              }}
            </p>
            <p class="customername field">
              <b class="label">Tên khách hàng: </b>{{ user.name }}
            </p>
          </v-col>
        </v-row>
      </div>
      <v-divider class="mt-2 mb-2"></v-divider>
      <div class="accessory">
        <p class="title">Đăng ký thuê phụ kiện</p>
        <user-accessory-table-form />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.rental-info {
  > .title {
    margin: 0 0 20px;
    text-align: center;
    font-size: 25px;
    font-weight: bold;
  }
  > .content > .fooballpitch > .row > .col > .carousel {
    height: 250px !important;
  }
  > .content > .fooballpitch > .row > .col > .description {
    display: flex;
  }
  > .content > .fooballpitch > .row > .col > .price {
    color: #e60000;
    font-weight: bold;
  }
  > .content > .fooballpitch > .row > .col > .price > .label {
    color: #000;
    font-weight: 600;
  }
  > .content > .fooballpitch > .row > .col > .field {
    margin-top: 10px;
  }
  > .content > .accessory > .title {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
