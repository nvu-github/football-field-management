<script lang="ts" setup>
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { useRuntimeConfig } from "nuxt/app";
import { useAppStore, useFootballPitchStore } from "~/stores";

const { $toast }: any = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const footballPitchStore = useFootballPitchStore();
const appStore = useAppStore();
const { breadCrumbs } = storeToRefs(appStore);
const { footballPitchRentalInfo } = storeToRefs(footballPitchStore);
breadCrumbs.value = [
  {
    title: "Trang chủ",
    disabled: false,
    href: "/",
  },
  {
    title: "Sân bóng",
    disabled: true,
    href: "/fooball-pitches",
  },
];

const format = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

function formattedFootballPitchRental(footballPitchRentalInfo: any) {
  if (footballPitchRentalInfo) {
    return footballPitchRentalInfo
      .filter(
        (rentalInfo: any) =>
          format(new Date(rentalInfo.rentalDate), "dd/MM/yyyy") ===
          format(new Date(), "dd/MM/yyyy")
      )
      .slice(0, 4);
  }
  return [];
}
footballPitchStore.getFootballPitchRentalInfo();
</script>
<template>
  <div class="football-pitch-page">
    <v-row class="row">
      <v-col class="col" md="4">
        <common-date-picker
          class="datepicker"
          placeholder="Thời gian thuê"
          :format="format"
        />
      </v-col>
      <v-col md="3">
        <v-autocomplete
          label="Khung giờ"
          :items="[
            'California',
            'Colorado',
            'Florida',
            'Georgia',
            'Texas',
            'Wyoming',
          ]"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col md="3">
        <v-autocomplete
          label="Trạng thái"
          :items="[
            'California',
            'Colorado',
            'Florida',
            'Georgia',
            'Texas',
            'Wyoming',
          ]"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col class="action" md="2">
        <v-btn class="button -success">
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Tìm kiếm
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md="6"
        v-for="rentalInfo in formattedFootballPitchRental(
          footballPitchRentalInfo
        )"
        :key="rentalInfo.id"
      >
        <user-football-pitch-card-info
          :id="rentalInfo.id"
          :name="rentalInfo.name"
          :startTime="rentalInfo.startTime"
          :endTime="rentalInfo.endTime"
          :rentalDate="rentalInfo.rentalDate"
          :price="rentalInfo.price"
          :status="rentalInfo.status"
          :football-pitch-type="rentalInfo.footballPitchTypeName"
          :avatar="`${runtimeConfig.public.API_URL}public/${rentalInfo.images[0].url}`"
        />
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.football-pitch-page {
  > .row > .col > .datepicker {
    margin-top: 15px;
  }
  > .row > .action {
    display: flex;
    align-items: center;
  }
}
</style>
