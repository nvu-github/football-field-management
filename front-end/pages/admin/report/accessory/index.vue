<script lang="ts" setup>
import { ref } from "vue";
const month = ref();
const year = ref();
</script>
<template>
  <div class="report-accessory">
    <v-row class="row">
      <v-col class="col" lg="4" xs="12">
        <common-date-picker
          v-model="month"
          class="datepicker"
          placeholder="Thời gian thuê"
          is-month-picker
        />
        {{ month }}
      </v-col>
      <v-col lg="3" xs="12">
        <common-date-picker
          v-model="year"
          class="datepicker"
          placeholder="Năm"
          is-year-picker
        />
        {{ year }}
      </v-col>
      <v-col class="action" md="lg" xs="12">
        <v-btn class="button -success">
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Lọc
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <table class="table">
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
        </table>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped></style>
