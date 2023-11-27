<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { monthItem, useReportStore, useAppStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const appStore = useAppStore();
const reportStore = useReportStore();
const { app } = storeToRefs(appStore);
const { accessoriesReport } = storeToRefs(reportStore);
const condition = ref({
  month: null,
  year: new Date().getFullYear(),
});
const totalAccessory = ref({
  amount: 0,
  price: 0,
});
app.value.title = "Thống kê phụ kiện";

watchEffect(() => {
  if (accessoriesReport && accessoriesReport.value.length > 0) {
    totalAccessory.value = accessoriesReport.value.reduce(
      (total, reportAccessory): any => {
        return {
          amount: (total.amount += reportAccessory.totalAmount),
          price: (total.price += reportAccessory.totalPrice),
        };
      },
      {
        amount: 0,
        price: 0,
      }
    );
  }
});

function filterReport() {
  reportStore.getAccessoryReport(condition.value);
}

reportStore.getAccessoryReport(condition.value);
</script>
<template>
  <div class="report-accessory">
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
              <th class="column" width="300">Tên phụ kiện</th>
              <th class="column" width="150">Loại phụ kiện</th>
              <th class="column" width="100">Số lượng thuê/bán</th>
              <th class="column" width="150">Tổng tiền thuê/bán</th>
            </tr>
          </thead>
          <tbody
            v-if="accessoriesReport && accessoriesReport.length > 0"
            class="body"
          >
            <tr
              class="row"
              v-for="(accessoryReport, index) in accessoriesReport"
              :key="index"
            >
              <td class="column text-center">{{ index + 1 }}</td>
              <td class="column">{{ accessoryReport.name }}</td>
              <td class="column">{{ accessoryReport.accessoryType.name }}</td>
              <td class="column text-center">
                {{ accessoryReport.totalAmount }}
              </td>
              <td class="column text-center">
                {{
                  accessoryReport.totalPrice > 0
                    ? `${formatPrice(accessoryReport.totalPrice)} ₫`
                    : 0
                }}
              </td>
            </tr>
            <tr class="row">
              <td class="column text-end" colspan="3">Tổng cộng</td>
              <td class="column text-center">{{ totalAccessory.amount }}</td>
              <td class="column text-center">
                {{
                  totalAccessory.price > 0
                    ? `${formatPrice(totalAccessory.price)} ₫`
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
