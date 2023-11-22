<script lang="ts" setup>
import VueApexCharts from "vue3-apexcharts";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const series = [
  {
    name: "Sân bóng",
    data: props.data.map((reportRevenue: any) => ({
      x: `Tháng ${reportRevenue.month}`,
      y: reportRevenue.totalRevenueFootballPitch,
    })),
  },
  {
    name: "Phụ kiện thuê",
    data: props.data.map((reportRevenue: any) => ({
      x: `Tháng ${reportRevenue.month}`,
      y: reportRevenue.totalRevenueAccessory.rental,
    })),
  },
  {
    name: "Phụ kiện bán",
    data: props.data.map((reportRevenue: any) => ({
      x: `Tháng ${reportRevenue.month}`,
      y: reportRevenue.totalRevenueAccessory.sell,
    })),
  },
];

const categories = props.data.map(
  (reportRevenue: any) => `Tháng ${reportRevenue.month}`
);

const options = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: false,
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
      borderRadius: 0,
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
    type: "category",
    categories: categories,
  },
  legend: {
    position: "bottom",
    offsetX: -10,
    offsetY: 0,
  },
  fill: {
    opacity: 1,
  },
};
</script>
<template>
  <VueApexCharts
    type="bar"
    height="350"
    :options="options"
    :series="series"
  />
</template>
