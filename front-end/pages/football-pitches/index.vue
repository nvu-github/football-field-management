<script lang="ts" setup>
import { ref } from "vue";
import { format, formatISO9075 } from "date-fns";
import { storeToRefs } from "pinia";
import { useRuntimeConfig, useNuxtApp } from "nuxt/app";
import {
  useAppStore,
  useFootballPitchStore,
  useLeasingDurationStore,
} from "~/stores";
import { formattedLeasingDuration } from "~/utils/object";

const { $toast }: any = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const footballPitchStore = useFootballPitchStore();
const leasingDurationStore = useLeasingDurationStore();
const appStore = useAppStore();
const { breadCrumbs }: any = storeToRefs(appStore);
const { footballPitchRentalInfo, footballPitches } =
  storeToRefs(footballPitchStore);
const { leasingDurations } = storeToRefs(leasingDurationStore);
const conditionFilterFootballPitch = ref<any>({
  rentalDate: new Date(),
  leasingDuration: null,
  footballPitchId: null,
});
const footballPitchInfoFound = ref<any>();
await footballPitchStore.getFootballPitchRentalInfo(
  formatISO9075(conditionFilterFootballPitch.value.rentalDate)
);

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

const formatDatePicker = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

footballPitchInfoFound.value = footballPitchRentalInfo.value;
async function filterFootballInfo() {
  const { rentalDate, leasingDuration, status, footballPitchId } =
    conditionFilterFootballPitch.value;

  if (rentalDate || leasingDuration || status) {
    if (rentalDate) {
      await footballPitchStore.getFootballPitchRentalInfo(
        formatISO9075(rentalDate)
      );
      footballPitchInfoFound.value = footballPitchRentalInfo.value;
    }

    footballPitchInfoFound.value = footballPitchRentalInfo.value.filter(
      (footballPitch: any) => {
        let condition = true;

        if (footballPitchId) {
          condition =
            condition && footballPitch.footballPitchId === footballPitchId;
        }

        if (leasingDuration) {
          const footballLeasingDuration = `${footballPitch.startTime} - ${footballPitch.endTime}`;
          condition = condition && footballLeasingDuration === leasingDuration;
        }

        return condition && footballPitch.status === "EMPTY";
      }
    );
  }
}

footballPitchStore.getFootballPitches();
leasingDurationStore.getLeasingDurationPublics();
</script>
<template>
  <div class="football-pitch-page">
    <v-row class="row">
      <v-col lg="4" xs="12">
        <v-autocomplete
          v-model="conditionFilterFootballPitch.footballPitchId"
          label="Sân bóng"
          item-value="id"
          item-title="name"
          :items="footballPitches"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col class="col" lg="2" xs="12">
        <common-date-picker
          v-model="conditionFilterFootballPitch.rentalDate"
          class="datepicker"
          placeholder="Thời gian thuê"
          :format="formatDatePicker"
        />
      </v-col>
      <v-col lg="2" xs="12">
        <v-autocomplete
          v-model="conditionFilterFootballPitch.leasingDuration"
          label="Khung giờ"
          item-value="name"
          item-title="name"
          :items="formattedLeasingDuration(leasingDurations)"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col class="action" md="2" xs="12">
        <v-btn class="button -success" @click="filterFootballInfo">
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Tìm kiếm
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="footballPitchInfoFound && footballPitchInfoFound.length > 0">
      <v-col
        md="4"
        v-for="rentalInfo in footballPitchInfoFound"
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
          :football-pitch-leasing-duration-id="
            rentalInfo.footballPitchLeasingDurationId
          "
          :avatar="
            rentalInfo.images.length > 0
              ? `${runtimeConfig.public.API_URL}public/${rentalInfo.images[0].url}`
              : defaultFootballImage
          "
        />
      </v-col>
    </v-row>
    <v-row class="empty" v-else> Không tìm thấy thông tin sân bóng </v-row>
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
