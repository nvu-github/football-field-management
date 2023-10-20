<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  durationTime: {
    type: String,
    required: true,
  },
  dateRental: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  }
})
</script>
<template>
  <v-card class="card-info">
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      class="avatar"
      cover
    ></v-img>
    <div class="card-content">
      <v-card-title class="title"> Top western road trips </v-card-title>
      <v-card-subtitle class="time">
        <div class="hour">
          <v-icon>mdi mdi-clock-time-nine-outline</v-icon> 10:00 - 11:30
        </div>
        <div class="day">
          <v-icon>mdi mdi-calendar-range</v-icon> 17/10/2023
        </div>
      </v-card-subtitle>
      <v-card-text class="content">
        <div class="status"> 
          <b class="title">Trạng thái:</b> <v-chip color="success">Đã thuê</v-chip>
        </div>  
        <div class="price mt-2">
          <b class="title">Giá thuê:</b> 500.000 VNĐ
        </div>
      </v-card-text>
      <v-card-action class="action">
        <v-tooltip location="bottom" text="Thuê ngay">
          <template #activator="{ props }">
          <v-btn v-bind="props" class="button -primary -rental">
            <v-icon>mdi mdi-alpha-r-circle-outline</v-icon>
          </v-btn>
        </template>
        </v-tooltip>
        <v-tooltip location="bottom" text="Chi tiết">
          <template #activator="{ props }">
          <v-btn v-bind="props" class="button -warning -rental">
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
  width: 45%;
  > .title {
    padding: 8px 0;
  }
  > .time {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }
  > .content {
    padding: 16px 0;
  }
  > .content > .price {
    color: #f75061;
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
    width: 45px;
    &:first-child {
      margin-right: 8px;
    }
  }
  > .action :deep(.v-icon)  {
    font-size: 20px;
  }
}
</style>
