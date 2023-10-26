<script lang="ts" setup>
import { format, formatISO9075 } from "date-fns";
import { storeToRefs } from "pinia";
import { useRuntimeConfig } from "nuxt/app";
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
const { breadCrumbs } = storeToRefs(appStore);
const { footballPitchRentalInfo } = storeToRefs(footballPitchStore);
const { leasingDurations } = storeToRefs(leasingDurationStore);
const conditionFilterFootballPitch = ref<any>({
  rentalDate: new Date(),
  leasingDuration: null,
  status: null,
});
const footballPitchInfoFound = ref<any>();
await footballPitchStore.getFootballPitchRentalInfo(
  formatISO9075(conditionFilterFootballPitch.value.rentalDate)
);

const statusFootballPitch = [
  {
    key: "EMPTY",
    title: "Trống",
  },
  {
    key: "ACCEPT",
    title: "Đã đặt",
  },
  {
    key: "PENDING",
    title: "Đang đặt",
  },
];

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
function filterFootballInfo() {
  const { rentalDate, leasingDuration, status } =
    conditionFilterFootballPitch.value;

  if (rentalDate || leasingDuration || status) {

    if (rentalDate) {
      footballPitchStore.getFootballPitchRentalInfo(
        formatISO9075(rentalDate)
      );
    }

    footballPitchInfoFound.value = footballPitchRentalInfo.value.filter(
      (footballPitch) => {
        let condition = true;

        if (leasingDuration) {
          const footballLeasingDuration = `${footballPitch.startTime} - ${footballPitch.endTime}`;
          condition = condition && footballLeasingDuration === leasingDuration;
        }

        if (status) {
          condition = condition && footballPitch.status === status;
        }

        return condition;
      }
    );
  }
}

leasingDurationStore.getLeasingDurations();
</script>
<template>
  <div class="football-pitch-page">
    <v-row class="row">
      <v-col class="col" md="4">
        <common-date-picker
          v-model="conditionFilterFootballPitch.rentalDate"
          class="datepicker"
          placeholder="Thời gian thuê"
          :format="formatDatePicker"
        />
      </v-col>
      <v-col md="3">
        <v-autocomplete
          v-model="conditionFilterFootballPitch.leasingDuration"
          label="Khung giờ"
          item-value="id"
          item-title="name"
          :items="formattedLeasingDuration(leasingDurations)"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col md="3">
        <v-autocomplete
          v-model="conditionFilterFootballPitch.status"
          label="Trạng thái"
          item-value="key"
          item-title="title"
          :items="statusFootballPitch"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col class="action" md="2">
        <v-btn class="button -success" @click="filterFootballInfo">
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
        v-for="rentalInfo in footballPitchInfoFound.map((footballPitch: any) => ({...footballPitch, rentalDate: format(new Date(footballPitch.rentalDate), 'dd/MM/yyyy')}))"
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
