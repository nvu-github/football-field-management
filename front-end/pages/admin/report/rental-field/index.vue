<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { monthItem, useReportStore, useAppStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const appStore = useAppStore();
const reportStore = useReportStore();
const { app } = storeToRefs(appStore);
const { rentalFieldReport } = storeToRefs(reportStore);
const condition = ref({
  month: null,
  year: new Date().getFullYear(),
});
const totalRentalField = ref({
  rented: 0,
  canceled: 0,
  revenue: 0,
});
app.value.title = "Thống kê lượt thuê";

watchEffect(() => {
  if (rentalFieldReport && rentalFieldReport.value.length > 0) {
    totalRentalField.value = rentalFieldReport.value.reduce(
      (total, reportAccessory): any => {
        return {
          rented: (total.rented += reportAccessory.totalRented),
          canceled: (total.canceled += reportAccessory.totalCanceled),
          revenue: (total.revenue += reportAccessory.totalRevenue),
        };
      },
      {
        rented: 0,
        canceled: 0,
        revenue: 0,
      }
    );
  }
});

function filterReport() {
  reportStore.getRentalFieldReport(condition.value);
}

reportStore.getRentalFieldReport(condition.value);
</script>
<template>
  <div class="report-rental-field">
    <v-row class="filter mb-5">
      <v-col class="col" lg="2" xs="12">
        <v-autocomplete
          v-model="condition.month"
          placeholder="Tháng"
          item-title="label"
          item-value="value"
          :items="monthItem"
          prepend-icon="mdi mdi-calendar-blank-outline"
          variant="underlined"
          :menu-icon="false"
          :hide-details="true"
          :clear-icon="true"
          clearable
        >
        </v-autocomplete>
      </v-col>
      <v-col lg="3" xs="12">
        <common-date-picker
          v-model="condition.year"
          class="datepicker"
          placeholder="Năm"
          is-year-picker
          :clear="true"
        />
      </v-col>
      <v-col class="action" md="7" xs="12">
        <v-btn class="button -success" @click="filterReport">
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Lọc
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-table class="table">
          <thead class="head">
            <tr class="row">
              <th class="column" width="50">STT</th>
              <th class="column" width="300">Tên sân bóng</th>
              <th class="column" width="150">Loại sân bóng</th>
              <th class="column" width="100">Tổng số lượt thuê (lượt)</th>
              <th class="column" width="150">Tổng số lượt hủy (lượt)</th>
              <th class="column" width="150">Tổng tiền thuê</th>
            </tr>
          </thead>
          <tbody
            v-if="rentalFieldReport && rentalFieldReport.length > 0"
            class="body"
          >
            <tr
              class="row"
              v-for="(rentalField, index) in rentalFieldReport"
              :key="index"
            >
              <td class="column text-center">{{ index + 1 }}</td>
              <td class="column">{{ rentalField.name }}</td>
              <td class="column">{{ rentalField.footballType.name }}</td>
              <td class="column text-center">
                {{ rentalField.totalRented }}
              </td>
              <td class="column text-center">
                {{ rentalField.totalCanceled }}
              </td>
              <td class="column text-center">
                {{
                  rentalField.totalRevenue > 0
                    ? `${formatPrice(rentalField.totalRevenue)} VNĐ`
                    : 0
                }}
              </td>
            </tr>
            <tr class="row">
              <td class="column text-end" colspan="3">Tổng cộng</td>
              <td class="column text-center">{{ totalRentalField.rented }}</td>
              <td class="column text-center">
                {{ totalRentalField.canceled }}
              </td>
              <td class="column text-center">
                {{
                  totalRentalField.revenue > 0
                    ? `${formatPrice(totalRentalField.revenue)} VNĐ`
                    : 0
                }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="body">
            <tr class="row">
              <td class="column" colspan="5">Không có dữ liệu</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.filter {
  :deep(.v-field) {
    height: 36px;
  }
  :deep(.v-field__input) {
    padding-top: 0;
  }

  :deep(.v-field__input) > input {
    top: 8px;
  }
  :deep(.v-autocomplete__selection) {
    position: absolute;
    top: 8px;
  }
  :deep(.v-input__prepend) {
    margin: 0;
    padding-top: 12px;
    padding-right: 5px;
    border-bottom: 1px solid #b4b2b2;
  }
  :deep(.v-input__prepend) > .v-icon {
    font-size: 18px;
    opacity: 0.5;
  }
}

.table {
  width: 100%;
  border-collapse: collapse;

  :deep(.head) > .row > .column,
  :deep(.body) > .row > .column {
    border: 1px solid #b4b2b2;
    font-size: 15px;
  }

  :deep(.head) > .row > .column {
    padding: 0 8px;
    text-align: center;
    background: #f3f3f3;
    color: #000;
    font-weight: 600;
  }
}
</style>
