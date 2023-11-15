<script lang="ts" setup>
import { ref } from "vue";
import { monthItem } from "~/stores";

const condition = ref({
  month: null,
  year: null,
});
</script>
<template>
  <div class="report-accessory">
    <v-row class="filter">
      <v-col class="col" lg="2" xs="12">
        <v-select
          v-model="condition.month"
          placeholder="Tháng"
          item-title="label"
          item-value="value"
          :items="[
            {
              label: 'Tất cả',
              value: null,
            },
            ...monthItem,
          ]"
          prepend-icon="mdi mdi-calendar-blank-outline"
          variant="underlined"
          :menu-icon="false"
          :hide-details="true"
          :clear-icon="true"
          clearable
        >
        </v-select>
      </v-col>
      <v-col lg="3" xs="12">
        <common-date-picker
          v-model="condition.year"
          class="datepicker"
          placeholder="Năm"
          is-year-picker
        />
      </v-col>
      <v-col class="action" md="7" xs="12">
        <v-btn class="button -success">
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
          <tbody class="body">
            <tr></tr>
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
  :deep(.v-select__selection) {
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
  }
}
</style>
