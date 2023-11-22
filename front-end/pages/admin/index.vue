<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useReportStore } from '~/stores';
const reportStore = useReportStore();
const { revenueReport } = storeToRefs(reportStore);

reportStore.getRevenueReport({year: new Date().getFullYear()});
</script>

<template>
  <div class="home-page">
    <common-chart-column-revenue v-if="revenueReport && revenueReport.length > 0" :data="revenueReport" />
  </div>
</template>
<style lang="scss" scoped>
</style>
