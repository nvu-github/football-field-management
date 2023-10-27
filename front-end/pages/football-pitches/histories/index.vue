<script lang="ts" setup>
import format from "date-fns/format";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const customerStore = useCustomerStore();
const { customerFootballPitchRentalHistories }: any =
  storeToRefs(customerStore);
const conditionFilterHistory = ref<any>({
  rentalDate: null,
  status: null,
});
const formattedHistories = ref<CustomerAccessoryRentalHistory>()
await customerStore.getCustomerFootballPitchRentalHisTories();

const formatDatePicker = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

formattedHistories.value = customerFootballPitchRentalHistories.value
function filterHistories() {
  const { rentalDate: rentalDateCondition, status: statusCondition } =
    conditionFilterHistory.value;

    formattedHistories.value =
    customerFootballPitchRentalHistories.value.filter(
      (customerFootballPitchRental: any) => {
        let condition: boolean = true;
        const { rentalDate, status } = customerFootballPitchRental;
        if (rentalDateCondition) {
          condition =
            condition &&
            format(new Date(rentalDate), "dd/MM/yyyy") ===
              format(new Date(rentalDateCondition), "dd/MM/yyyy");
        }

        if (statusCondition) {
          condition = condition && statusCondition === status;
        }

        return condition;
      }
    );
}

function getStatusInfo(status: string) {
  let text = "Đã thuê";
  let color = "success";

  if (status === "PENDING") {
    text = "Chờ xác nhận";
    color = "orange";
  }

  if (status === "REJECT") {
    text = "Từ chối";
    color = "danger";
  }

  return {
    text,
    color,
  };
}

</script>
<template>
  <div class="football-pitches-history-page">
    <v-row class="row">
      <v-col class="col" md="4">
        <common-date-picker
          v-model="conditionFilterHistory.rentalDate"
          class="datepicker"
          placeholder="Thời gian thuê"
          :format="formatDatePicker"
        />
      </v-col>
      <v-col md="3">
        <v-autocomplete
          v-model="conditionFilterHistory.status"
          label="Trạng thái"
          item-value="key"
          item-title="title"
          :items="statusFootballPitch"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col class="action" md="2">
        <v-btn class="button -success" @click="filterHistories">
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Tìm kiếm
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="formattedHistories && formattedHistories.length > 0">
      <v-col md="6">
        <v-card
          class="mx-auto mt-3"
          prepend-icon="mdi mdi-soccer-field"
          variant="outlined"
          v-for="customerFootballPitchRental in formattedHistories"
          :key="customerFootballPitchRental.id"
        >
          <template v-slot:title>
            {{ customerFootballPitchRental.footballPitchName }}
          </template>
          <v-card-subtitle class="subtitle">
            <div class="hour">
              <v-icon>mdi mdi-clock-time-nine-outline</v-icon>
              {{ customerFootballPitchRental.startTime }} -
              {{ customerFootballPitchRental.endTime }}
            </div>
            <div class="day">
              <v-icon>mdi mdi-calendar-range</v-icon>
              {{
                format(
                  new Date(customerFootballPitchRental.rentalDate),
                  "dd/MM/yyyy"
                )
              }}
            </div>
            <div class="price">
              <v-icon>mdi mdi-cash</v-icon>
              <span class="value">
                {{ formatPrice(customerFootballPitchRental.price) }}
                <span class="unit">VNĐ</span>
              </span>
            </div>
          </v-card-subtitle>
          <v-card-action class="actionbtn">
            <div class="status">
              <label for="">Trạng thái: </label>
              <v-chip
                :color="getStatusInfo(customerFootballPitchRental.status).color"
                >{{
                  getStatusInfo(customerFootballPitchRental.status).text
                }}</v-chip
              >
            </div>
            <div class="action">
              <v-tooltip location="bottom" text="Chi tiết">
                <template #activator="{ props }">
                  <v-btn v-bind="props" class="button -primary -rental">
                    <v-icon>mdi mdi-alpha-d-circle-outline</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip location="bottom" text="Hóa đơn">
                <template #activator="{ props }">
                  <v-btn v-bind="props" class="button -warning -rental">
                    <v-icon>mdi mdi-receipt-text</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </v-card-action>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="empty" v-else>
      Không có thông tin đặt sân
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.football-pitches-history-page {
  > .row > .col > .datepicker {
    margin-top: 15px;
  }

  > .row > .action {
    display: flex;
    align-items: center;
  }

  :deep(.v-card) {
    border-color: #a9ca31;
  }

  :deep(.subtitle) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.subtitle) > .price {
    display: flex;
    align-items: center;
  }

  :deep(.subtitle) > .price > .value {
    margin-top: 1.5px;
    color: #e60000;
    font-weight: bold;
  }

  :deep(.v-card) {
    padding-bottom: 10px;
  }

  :deep(.time) {
    display: flex;
    justify-content: space-between;
  }

  :deep(.actionbtn) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-right: 10px;
  }

  :deep(.actionbtn) > .status {
    margin-left: 10px;
  }

  :deep(.actionbtn) > .action > .button {
    padding: 0;
    min-width: 45px;
    &:first-child {
      margin-right: 8px;
    }
  }

  :deep(.actionbtn) :deep(.v-icon) {
    font-size: 20px;
  }

  :deep(.dp__clear_icon) {
    display: block;
  }
}

.emtpy {
  justify-content: center;
  font-size: 30px;
}
</style>
