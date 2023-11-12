<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { resolveComponent } from "vue";
import { format, isAfter, isSameDay } from "date-fns";
import { useNuxtApp, navigateTo } from "nuxt/app";
import { useCustomerStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  rentalDate: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  footballPitchType: {
    type: String,
    required: true,
  },
  footballPitchLeasingDurationId: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});
const { $toast }: any = useNuxtApp();
const customerStore = useCustomerStore();
const { payloadCustomerFootballPitchRental }: any = storeToRefs(customerStore);

function getStatusFootball(status: string) {
  let message = "Đã đặt";
  let color = "error";

  if (status === "PENDING") {
    message = "Đang đặt";
    color = "deep-purple";
  }

  if (status === "EMPTY") {
    message = "Trống";
    color = "primary";
  }

  return {
    message,
    color,
  };
}

function navigateToRental(id: number) {
  const currentDate = new Date();
  const validDate =
    isAfter(new Date(props.rentalDate), currentDate) ||
    isSameDay(new Date(props.rentalDate), currentDate);

  if (!validDate) {
    return $toast.error("Quý khách không thể đặt sân trước ngày hiện tại!");
  }
  payloadCustomerFootballPitchRental.value.footballPitchId = Number(id);
  payloadCustomerFootballPitchRental.value.leasingDurationId = Number(
    props.footballPitchLeasingDurationId
  );
  payloadCustomerFootballPitchRental.value.rentalDate = new Date(
    props.rentalDate
  );
  return navigateTo(`/football-pitches/rental?type=now`);
}
</script>
<template>
  <v-card class="card-info mx-auto">
    <v-img :src="props.avatar" class="avatar" cover></v-img>
    <div class="card-content">
      <v-card-title class="title"> {{ props.name }} </v-card-title>
      <v-card-subtitle class="time">
        <div class="hour">
          <v-icon>mdi mdi-clock-time-nine-outline</v-icon>
          {{ props.startTime }} - {{ props.endTime }}
        </div>
        <div class="day">
          <v-icon>mdi mdi-calendar-range</v-icon>
          {{ format(new Date(props.rentalDate), "dd/MM/yyyy") }}
        </div>
      </v-card-subtitle>
      <v-card-text class="content pt-0">
        <div class="type mt-2 mb-2">
          <b class="title">Loại sân: </b>
          <v-chip color="success">{{ props.footballPitchType }}</v-chip>
        </div>
        <div class="status">
          <b class="title">Trạng thái: </b>
          <v-chip
            :class="{
              pending: props.status,
            }"
            :color="getStatusFootball(props.status).color"
            >{{ getStatusFootball(props.status).message }}</v-chip
          >
        </div>
        <div class="price mt-2">
          <b class="title">Giá thuê:</b> {{ formatPrice(props.price) }} VNĐ
        </div>
      </v-card-text>
      <v-card-action class="action">
        <v-tooltip location="bottom" text="Đặt sân">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="button -primary -rental"
              @click="navigateToRental(id)"
            >
              <v-icon>mdi mdi-alpha-r-circle-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Chi tiết">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="button -warning -rental"
              :to="`/football-pitches/${id}/detail`"
            >
              <v-icon>mdi mdi-alpha-d-circle-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-card-action>
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
.card-info {
  display: flex;
  width: 100%;
  &:hover {
    transform: translateY(-1px) scale(1.005) translateZ(0);
  }
  > :deep(.v-img) {
    width: 54%;
    height: 200px;
    flex: none;
  }
  > :deep(.v-img) > .v-img__img {
    width: 300px;
  }
}

.card-content {
  padding-left: 10px;
  width: 45%;
  > .title {
    padding: 0;
  }
  > .time {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }
  > .content {
    padding: 16px 0 2px;
  }
  > .content > .price {
    color: #e60000;
  }
  > .content > .price > .title {
    color: #000;
  }
  > .action {
    display: flex;
    justify-content: flex-end;
  }
  > .action > .button {
    padding: 0;
    min-width: 45px;
    &:first-child {
      margin-right: 8px;
    }
  }
  > .action :deep(.v-icon) {
    font-size: 20px;
  }
}
</style>
