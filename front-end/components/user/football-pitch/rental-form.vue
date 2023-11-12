<script lang="ts" setup>
import { watchEffect, ref } from "vue";
import { storeToRefs } from "pinia";
import {useRouter} from "nuxt/app"
import {
  useCustomerStore,
  useFootballPitchStore,
  useFootballPitchPriceStore,
} from "~/stores";

const rules = {
  footballPitch: (value: number) => {
    if (!value) return "Vui lòng chọn thông tin sân bóng";
  },
  leasingDuration: (value: number) => {
    if (!value) return "Vui lòng chọn thông tin khung giờ";
  },
};

const router = useRouter()
const customerStore = useCustomerStore();
const footballPitchStore = useFootballPitchStore();
const footballPitchPriceStore = useFootballPitchPriceStore();
const { footballPitchPrices } = storeToRefs(footballPitchPriceStore);
const { footballPitches } = storeToRefs(footballPitchStore);
const { payloadCustomerFootballPitchRental } = storeToRefs(customerStore);
const leasingDurationFound = ref<any>([]);

watchEffect(async () => {
  const { footballPitchId } = payloadCustomerFootballPitchRental.value;

  if (footballPitchId) {
    leasingDurationFound.value = footballPitchPrices.value.filter(
      (leasingDuration) => leasingDuration.footballPitchId === footballPitchId
    );
  }
});
const format = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
function handleSelectedFootballPitch() {
  payloadCustomerFootballPitchRental.value.rentalDate = null;
  payloadCustomerFootballPitchRental.value.leasingDurationId = null;
  router.push('/football-pitches/rental')
}
</script>
<template>
  <div class="rental-form">
    <v-autocomplete
      v-model="payloadCustomerFootballPitchRental.footballPitchId"
      label="Chọn sân bóng*"
      item-value="id"
      item-title="name"
      variant="underlined"
      :rules="[rules.footballPitch]"
      :items="footballPitches"
      @update:modelValue="handleSelectedFootballPitch"
    ></v-autocomplete>
    <common-date-picker
      v-model="payloadCustomerFootballPitchRental.rentalDate"
      message-error="Vui lòng chọn thời than thuê"
      placeholder="Chọn thời gian thuê"
      :format="format"
      :disabled="!payloadCustomerFootballPitchRental.footballPitchId"
    />
    <v-select
      v-model="payloadCustomerFootballPitchRental.leasingDurationId"
      label="Chọn khung giờ*"
      item-value="id"
      item-title="leasingDurationName"
      variant="underlined"
      class="mt-2"
      :items="leasingDurationFound"
      :disabled="!payloadCustomerFootballPitchRental.footballPitchId"
    ></v-select>
    <v-textarea
      v-model="payloadCustomerFootballPitchRental.note"
      label="Ghi chú"
      type="text"
      variant="underlined"
      required
      rows="5"
    ></v-textarea>
  </div>
</template>
