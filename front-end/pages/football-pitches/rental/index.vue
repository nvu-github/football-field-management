<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores";

const appStore = useAppStore();
const { breadCrumbs } = storeToRefs(appStore);
breadCrumbs.value = [
  {
    title: "Trang chủ",
    disabled: false,
    href: "/",
  },
  {
    title: "Đặt sân",
    disabled: true,
    href: "/fooball-piches/rental",
  },
];
</script>
<template>
  <div class="football-pitches-rental-page">
    <v-row class="row">
      <v-col :md="4" class="form">
        <users-football-pitches-rental-form />
      </v-col>
      <v-col md="7" class="info">
        <users-football-pitches-rental-info />
      </v-col>
      <div class="action">
        <v-btn class="button -success"> Đặt sân </v-btn>
      </div>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.football-pitches-rental-page {
  > .row > .info {
    margin-left: 30px;
    width: 100%;
    border-left: 1px solid #b4b2b2;
  }
  > .row > .action {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 30px;
  }
  > .row > .action > .button {
    width: 300px;
  }
}
</style>
