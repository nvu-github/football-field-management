<script lang="ts" setup>
import { ref, resolveComponent } from "vue";
import format from "date-fns/format";
import { storeToRefs } from "pinia";
import {
  useCustomerStore,
  useAppStore,
  useDialogStore,
  useFootballPitchStore,
  usePaymentStore,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const appStore = useAppStore();
const dialogStore = useDialogStore();
const paymentStore = usePaymentStore();
const customerStore = useCustomerStore();
const footballPitchStore = useFootballPitchStore();
const { breadCrumbs } = storeToRefs(appStore);
const { customerFootballPitchRentalHistories }: any =
  storeToRefs(customerStore);
const conditionFilterHistory = ref<any>({
  rentalDate: null,
  status: null,
});
const formattedHistories = ref<CustomerAccessoryRentalHistory>();

breadCrumbs.value = [
  {
    title: "Trang chủ",
    disabled: false,
    href: "/",
  },
  {
    title: "Lịch sử đặt sân",
    disabled: true,
    href: "/fooball-piches/rental",
  },
];

const formatDatePicker = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

localStorage.removeItem("paymentMethod");
await customerStore.getCustomerFootballPitchRentalHisTories();
formattedHistories.value = customerFootballPitchRentalHistories.value;
function filterHistories() {
  const { rentalDate: rentalDateCondition, status: statusCondition } =
    conditionFilterHistory.value;

  formattedHistories.value = customerFootballPitchRentalHistories.value.filter(
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

function openDialogDetail(id: number) {
  dialogStore.showDialog(
    resolveComponent("common-football-pitch-dialog-rental-detail"),
    {
      id,
    }
  );
}

async function paymentInvoice(invoiceId: number, price: number) {
  const paymentUrl = await paymentStore.createPaymentUrl({
    amount: Number(price),
  });
  const { paymentRedirect } = paymentUrl.data;
  localStorage.setItem(
    "paymentMethod",
    JSON.stringify({
      invoiceId,
      status: "paid",
    })
  );
  window.location.href = paymentRedirect;
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
      <v-col
        md="6"
        v-for="customerFootballPitchRental in formattedHistories"
        :key="customerFootballPitchRental.id"
      >
        <v-card
          class="mx-auto mt-3"
          prepend-icon="mdi mdi-soccer-field"
          variant="outlined"
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
                {{ formatPrice(customerFootballPitchRental.totalPrice) }}
                <span class="unit">₫</span>
              </span>
            </div>
          </v-card-subtitle>
          <v-card-action class="actionbtn">
            <div class="status">
              <label for="">Trạng thái: </label>
              <v-chip
                :color="
                  footballPitchStore.getStatusCustomerFootballPitchRental(
                    customerFootballPitchRental.status
                  ).color
                "
                >{{
                  footballPitchStore.getStatusCustomerFootballPitchRental(
                    customerFootballPitchRental.status
                  ).text
                }}</v-chip
              >
            </div>
            <div class="action">
              <v-tooltip location="bottom" text="Chi tiết">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="button -primary -rental"
                    @click="
                      openDialogDetail(
                        customerFootballPitchRental.customerFootballPitchRentalId
                      )
                    "
                  >
                    <v-icon>mdi mdi-alpha-d-circle-outline</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip location="bottom" text="Thanh toán">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="button -warning -rental"
                    :disabled="
                      customerFootballPitchRental.invoiceStatus === 'PAID'
                    "
                    @click="
                      paymentInvoice(
                        customerFootballPitchRental.invoiceId,
                        Number(customerFootballPitchRental.totalPrice) -
                          Number(customerFootballPitchRental.moneyPaid)
                      )
                    "
                  >
                    <v-icon>mdi mdi-cash-multiple</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <!-- <v-tooltip location="bottom" text="Hủy đặt sân">
                <template #activator="{ props }">
                  <v-btn v-bind="props" class="button -danger">
                    <v-icon> mdi mdi-close-circle-outline </v-icon>
                  </v-btn>
                </template>
              </v-tooltip> -->
            </div>
          </v-card-action>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else class="empty"> Không có thông tin đặt sân </v-row>
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
