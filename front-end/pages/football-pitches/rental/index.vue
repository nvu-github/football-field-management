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
    <!-- <h1>đặt sân</h1> -->
    <v-row>
      <v-col md="8"> <users-football-pitches-rental-form /> </v-col>
      <v-col md="4"> 
        <div class="title">
          Title
        </div> </v-col>
    </v-row>
  </div>
</template>
