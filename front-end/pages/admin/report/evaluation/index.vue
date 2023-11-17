<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { monthItem, useReportStore, useAppStore } from "~/stores";
import { formatPrice } from "~/utils/string";

const appStore = useAppStore();
const reportStore = useReportStore();
const { app } = storeToRefs(appStore);
const { evaluationReport } = storeToRefs(reportStore);
const condition = ref({
  month: null,
  year: new Date().getFullYear(),
});
const totalEvaluation = ref({
  count: {
    good: 0,
    bad: 0,
  },
  score: {
    good: 0,
    bad: 0,
  },
  scorePercent: {
    good: 0,
    bad: 0,
  },
});
app.value.title = "Thống kê đánh giá";

watchEffect(() => {
  if (evaluationReport && evaluationReport.value.length > 0) {
    totalEvaluation.value = evaluationReport.value.reduce(
      (total, reportEvaluation): any => {
        total.count.good += reportEvaluation.totalCount.good;
        total.count.bad += reportEvaluation.totalCount.bad;
        total.score.good += reportEvaluation.totalScore.good;
        total.score.bad += reportEvaluation.totalScore.bad;
        total.scorePercent.good += reportEvaluation.totalScorePercent.good;
        total.scorePercent.bad += reportEvaluation.totalScorePercent.bad;

        return total;
      },
      {
        count: {
          good: 0,
          bad: 0,
        },
        score: {
          good: 0,
          bad: 0,
        },
        scorePercent: {
          good: 0,
          bad: 0,
        },
      }
    );
  }
});

function filterReport() {
  reportStore.getEvaluationReport(condition.value);
}

reportStore.getEvaluationReport(condition.value);
</script>
<template>
  <div class="report-evaluation">
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
              <th class="column" width="50" rowspan="2">STT</th>
              <th class="column" width="300" rowspan="2">Tên sân bóng</th>
              <th class="column" width="150" rowspan="2">Loại sân bóng</th>
              <th class="column" width="100" colspan="2">Số lượt đánh giá (Lượt)</th>
              <th class="column" width="100" colspan="2">Điểm đánh giá (Điểm)</th>
              <th class="column" width="100" colspan="2">Tỷ lệ đánh giá (%)</th>
            </tr>
            <tr class="row">
              <th class="column" width="100">Không tốt</th>
              <th class="column" width="100">Tốt</th>
              <th class="column" width="100">Không tốt</th>
              <th class="column" width="100">Tốt</th>
              <th class="column" width="100">Không tốt</th>
              <th class="column" width="100">Tốt</th>
            </tr>
          </thead>
          <!-- <tbody
            v-if="evaluationReport && evaluationReport.length > 0"
            class="body"
          >
            <tr
              class="row"
              v-for="(accessoryReport, index) in evaluationReport"
              :key="index"
            >
              <td class="column text-center">{{ index + 1 }}</td>
              <td class="column">{{ accessoryReport.name }}</td>
              <td class="column">{{ accessoryReport.footballType.name }}</td>
              <td class="column text-center">
                {{ accessoryReport.totalAmount }}
              </td>
              <td class="column text-center">
                {{
                  accessoryReport.totalPrice > 0
                    ? `${formatPrice(accessoryReport.totalPrice)} VNĐ`
                    : 0
                }}
              </td>
            </tr>
            <tr class="row">
              <td class="column text-end" colspan="3">Tổng cộng</td>
              <td class="column text-center">{{ totalEvaluation.amount }}</td>
              <td class="column text-center">
                {{
                  totalEvaluation.price > 0
                    ? `${formatPrice(totalEvaluation.price)} VNĐ`
                    : 0
                }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="body">
            <tr class="row">
              <td class="column" colspan="5">Không có dữ liệu</td>
            </tr>
          </tbody> -->
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
  }

  :deep(.head) > .row > .column {
    padding: 0 8px;
    text-align: center;
    color: #000;
    font-weight: 600;
  }
}
</style>
