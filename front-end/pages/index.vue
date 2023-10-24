<script lang="ts" setup>
import defaultFootballImage from "~/public/logo.png";
import { format, isEqual } from "date-fns";
import { storeToRefs } from "pinia";
import { useRuntimeConfig } from "nuxt/app";
import {
  useAppStore,
  useAccessoryStore,
  useFootballPitchStore,
} from "~/stores";
const appStore = useAppStore();
const accessoryStore = useAccessoryStore();
const footballPitchStore = useFootballPitchStore();
const { breadCrumbs } = storeToRefs(appStore);
const { accessories } = storeToRefs(accessoryStore);
const { footballPitchRentalInfo } = storeToRefs(footballPitchStore);
const runtimeConfig = useRuntimeConfig();
breadCrumbs.value = [];

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

accessoryStore.getAccessories();
footballPitchStore.getFootballPitchRentalInfo();
</script>
<template>
  <div class="home-page">
    <v-row>
      <v-col md="12">
        <nuxt-link class="link" to="#">
          <h1 class="h1">Lịch đặt sân hôm nay</h1>
        </nuxt-link>
      </v-col>
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
          :avatar="
            rentalInfo.images.length > 0
              ? `${runtimeConfig.public.API_URL}public/${rentalInfo.images[0].url}`
              : defaultFootballImage
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <nuxt-link class="link" to="#">
          <h1 class="h1">Danh sách phụ kiện</h1>
        </nuxt-link>
      </v-col>
      <v-col
        md="4"
        v-for="asccessory in accessories.slice(0, 6)"
        :key="asccessory.id"
      >
        <user-accessory-card-info
          :id="asccessory.id"
          :name="asccessory.name"
          :price="asccessory.price"
          :typeId="asccessory.accessoryType.id"
          :typeName="asccessory.accessoryType.name"
          :avatar="
            asccessory.accessoryImage.length > 0
              ? `${runtimeConfig.public.API_URL}public/${asccessory.accessoryImage[0].url}`
              : defaultFootballImage
          "
        />
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.home-page {
  > .h1 {
    font-size: 20px;
  }
}
.link {
  color: black;
  text-decoration: none;
}
</style>
