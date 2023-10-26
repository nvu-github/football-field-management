<script lang="ts" setup>
const formatDatePicker = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
</script>
<template>
  <div class="football-pitches-history-page">
    <v-row class="row">
      <v-col class="col" md="4">
        <common-date-picker
          class="datepicker"
          placeholder="Thời gian thuê"
          :format="formatDatePicker"
        />
      </v-col>
      <v-col md="3">
        <v-autocomplete
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
      <v-col md="6">
        <v-card
          class="mx-auto"
          prepend-icon="mdi mdi-soccer-field"
          variant="outlined"
        >
          <template v-slot:title> Sân bóng hoàng quân 1 </template>
          <v-card-subtitle class="subtitle">
            <div class="hour">
              <v-icon>mdi mdi-clock-time-nine-outline</v-icon>
              10:01 - 11:01
            </div>
            <div class="day">
              <v-icon>mdi mdi-calendar-range</v-icon>
              20/10/2023
            </div>
            <div class="price">
              <v-icon>mdi mdi-cash</v-icon>
              <span class="value"> 100.000 <span class="unit">VNĐ</span> </span>
            </div>
          </v-card-subtitle>
          <v-card-action class="actionbtn">
            <div class="status">
              <label for="">Trạng thái: </label>
              <v-chip color="primary">Đã thuê</v-chip>
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
}

.emtpy {
  justify-content: center;
  font-size: 30px;
}
</style>
