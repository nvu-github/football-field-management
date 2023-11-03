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
const { footballPitch } = storeToRefs(footballPitchStore);
const { paramFootballPitchRental }: any = storeToRefs(customerStore);
const { payloadAmountPayment } = storeToRefs(paymentStore);
const { user }: any = storeToRefs(authStore);
const footballPitchPriceFound: any = ref<Object>({});

watchEffect(async () => {
  const { footballPitchId, leasingDurationId } = paramFootballPitchRental.value;
  if (footballPitchId) {
    await footballPitchStore.getFootballPitch(
      paramFootballPitchRental.value.footballPitchId
    );
  }

  if (leasingDurationId) {
    await footballPitchPriceStore.getFootballPitchPrices();
    const leasingDurationRentalId = footballPitchPrices.value.find(
      (footballPitchPrice) => footballPitchPrice.id === leasingDurationId
    );
    footballPitchPriceFound.value = footballPitchPrices.value.find(
      (footballPitchPrice) =>
        footballPitchPrice.leasingDurationId ===
          leasingDurationRentalId?.leasingDurationId &&
        footballPitchPrice.footballPitchId === footballPitchId
    );
    payloadAmountPayment.value.pricePayment =
      footballPitchPriceFound.value.price;
  }
});
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
            :md="footballPitch && footballPitch.images.length > 0 ? 6 : 12"
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
            <p class="date field">
              <b class="label">Ngày thuê: </b>
              {{
                paramFootballPitchRental && paramFootballPitchRental.rentalDate
                  ? format(
                      new Date(paramFootballPitchRental.rentalDate),
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
      <div class="accessory-rental">
        <common-user-accessory-table-form />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.rental-info {
  > .title {
    margin: 0 0 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
  > .content > .fooballpitch > .row > .col > .carousel {
    height: 200px !important;
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
}
</style>
