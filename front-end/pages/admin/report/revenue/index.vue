<script lang="ts" setup>
import VueApexCharts from "vue3-apexcharts";
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { monthItem, useReportStore, useAppStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const appStore = useAppStore();
const reportStore = useReportStore();
const { app } = storeToRefs(appStore);
const { revenueReport } = storeToRefs(reportStore);
const condition = ref({
  month: null,
  year: new Date().getFullYear(),
});
const totalRevenue = ref({
  revenueFootballPitch: 0,
  revenueAccessory: {
    rental: 0,
    sell: 0,
  },
  revenue: 0,
});
app.value.title = "Thống kê doanh thu";

watchEffect(() => {
  if (revenueReport && revenueReport.value.length > 0) {
    totalRevenue.value = revenueReport.value.reduce(
      (total, reportAccessory): any => {
        return {
          revenueFootballPitch: (total.revenueFootballPitch +=
            reportAccessory.totalRevenueFootballPitch),
          revenueAccessory: {
            rental: (total.revenueAccessory.rental +=
              reportAccessory.totalRevenueAccessory.rental),
            sell: (total.revenueAccessory.sell +=
              reportAccessory.totalRevenueAccessory.sell),
          },
          revenue: (total.revenue += reportAccessory.totalRevenue),
        };
      },
      {
        revenueFootballPitch: 0,
        revenueAccessory: {
          rental: 0,
          sell: 0,
        },
        revenue: 0,
      }
    );
  }
});

function filterReport() {
  reportStore.getRevenueReport(condition.value);
}

const series = [
  {
    name: "PRODUCT A",
    data: [44, 55, 41, 67, 22, 43],
  },
  {
    name: "PRODUCT B",
    data: [13, 23, 20, 8, 13, 27],
  },
  {
    name: "PRODUCT C",
    data: [11, 17, 15, 15, 21, 14],
  },
  {
    name: "PRODUCT D",
    data: [21, 7, 25, 13, 22, 8],
  },
];

const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
        },
      },
    },
  },
  xaxis: {
    type: "datetime",
    categories: [
      "01/01/2011 GMT",
      "01/02/2011 GMT",
      "01/03/2011 GMT",
      "01/04/2011 GMT",
      "01/05/2011 GMT",
      "01/06/2011 GMT",
    ],
  },
  legend: {
    position: "right",
    offsetY: 40,
  },
  fill: {
    opacity: 1,
  },
};

reportStore.getRevenueReport(condition.value);
</script>
<template>
  <div class="report-revenue">
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
    <VueApexCharts
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
    <v-row>
      <v-col md="12">
        <v-table class="table">
          <thead class="head">
            <tr class="row">
              <th class="column" width="50" rowspan="2">STT</th>
              <th class="column" width="200" rowspan="2">Tháng</th>
              <th class="column" width="120" rowspan="2">Sân bóng (VNĐ)</th>
              <th class="column" width="100" colspan="2">Phụ kiện</th>
              <th class="column" width="100" rowspan="2">Tổng tiền (VNĐ)</th>
            </tr>
            <tr class="row">
              <td class="column" width="150">Thuê (VNĐ)</td>
              <td class="column" width="150">Bán (VNĐ)</td>
            </tr>
          </thead>
          <tbody v-if="revenueReport && revenueReport.length > 0" class="body">
            <tr
              class="row"
              v-for="(revenue, index) in revenueReport"
              :key="index"
            >
              <td class="column text-center">{{ index + 1 }}</td>
              <td class="column text-center">{{ revenue.month }}</td>
              <td class="column text-center">
                {{
                  revenue.totalRevenueFootballPitch > 0
                    ? `${formatPrice(revenue.totalRevenueFootballPitch)} VNĐ`
                    : 0
                }}
              </td>
              <td class="column text-center">
                {{
                  revenue.totalRevenueAccessory.rental > 0
                    ? `${formatPrice(revenue.totalRevenueAccessory.rental)} VNĐ`
                    : 0
                }}
              </td>
              <td class="column text-center">
                {{
                  revenue.totalRevenueAccessory.sell > 0
                    ? `${formatPrice(revenue.totalRevenueAccessory.sell)} VNĐ`
                    : 0
                }}
              </td>
              <td class="column text-center">
                {{
                  revenue.totalRevenue > 0
                    ? `${formatPrice(revenue.totalRevenue)} VNĐ`
                    : 0
                }}
              </td>
            </tr>
            <tr class="row">
              <td class="column text-end" colspan="2">Tổng cộng</td>
              <td class="column text-center">
                {{
                  totalRevenue.revenueFootballPitch > 0
                    ? `${formatPrice(totalRevenue.revenueFootballPitch)} VNĐ`
                    : 0
                }}
              </td>
              <td class="column text-center">
                {{
                  totalRevenue.revenueAccessory.rental > 0
                    ? `${formatPrice(totalRevenue.revenueAccessory.rental)} VNĐ`
                    : 0
                }}
              </td>
              <td class="column text-center">
                {{
                  totalRevenue.revenueAccessory.sell > 0
                    ? `${formatPrice(totalRevenue.revenueAccessory.sell)} VNĐ`
                    : 0
                }}
              </td>
              <td class="column text-center">
                {{
                  totalRevenue.revenue > 0
                    ? `${formatPrice(totalRevenue.revenue)} VNĐ`
                    : 0
                }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="body">
            <tr class="row">
              <td class="column" colspan="6">Không có dữ liệu</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.report-revenue {
  margin-bottom: 50px;
}
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
    text-align: center;
    background: #f3f3f3;
    color: #000;
    font-weight: 600;
  }
}
</style>
