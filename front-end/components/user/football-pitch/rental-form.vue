<script lang="ts" setup>
import { storeToRefs } from "pinia";
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

const customerStore = useCustomerStore();
const footballPitchStore = useFootballPitchStore();
const footballPitchPriceStore = useFootballPitchPriceStore();
const { footballPitchPrices } = storeToRefs(footballPitchPriceStore);
const { footballPitches } = storeToRefs(footballPitchStore);
const { paramFootballPitchRental } = storeToRefs(customerStore);
const leasingDurationFound = ref<any>([]);

watchEffect(async () => {
  const { footballPitchId } = paramFootballPitchRental.value;

  if (footballPitchId) {
    await footballPitchPriceStore.getFootballPitchPrices();
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
footballPitchStore.getFootballPitches();
</script>
<template>
  <div class="rental-form">
    <v-autocomplete
      v-model="paramFootballPitchRental.footballPitchId"
      label="Chọn sân bóng*"
      item-value="id"
      item-title="name"
      variant="underlined"
      :rules="[rules.footballPitch]"
      :items="footballPitches"
    ></v-autocomplete>
    <common-date-picker
      v-model="paramFootballPitchRental.dateRental"
      :format="format"
      message-error="Vui lòng chọn thời than thuê"
      placeholder="Chọn thời gian thuê"
    />
    <v-autocomplete
      v-model="paramFootballPitchRental.leasingDurationId"
      label="Chọn khung giờ*"
      item-value="leasingDurationId"
      item-title="leasingDurationName"
      variant="underlined"
      class="mt-2"
      :items="
        paramFootballPitchRental.footballPitchId ? leasingDurationFound : []
      "
    ></v-autocomplete>
    <v-textarea
      v-model="paramFootballPitchRental.note"
      label="Ghi chú"
      type="text"
      variant="underlined"
      required
      rows="5"
    ></v-textarea>
  </div>
</template>
<style lang="scss" scoped>
.rental-form {
  // > .form {
  //   display: flex;
  //   flex-direction: column;
  // }
  // > .form > .action {
  //   display: flex;
  //   justify-content: center;
  // }
  // > .form > .action > .button {
  //   width: 50%;
  // }
}
</style>
