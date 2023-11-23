<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useReportStore, useAppStore, useUserStore } from "~/stores";

const appStore = useAppStore();
const reportStore = useReportStore();
const userStore = useUserStore();
const { revenueReport, rentalFieldReport, accessoriesReport } =
  storeToRefs(reportStore);
const { app } = storeToRefs(appStore);
const { accounts } = storeToRefs(userStore);
app.value.title = "";
const totalFootballRented = ref<number>();
const totalAccessoryRented = ref<number>();
const totalCustomer = ref<number>();
const CUSTOMER_ROLE = "4";

watchEffect(() => {
  if (rentalFieldReport) {
    totalFootballRented.value = rentalFieldReport.value.reduce(
      (total, reportRentalField): any => {
        return (total += reportRentalField.totalRented);
      },
      0
    );
    totalAccessoryRented.value = accessoriesReport.value.reduce(
      (total, accessoriesReport): any => {
        return (total += accessoriesReport.totalRented);
      },
      0
    );
    totalCustomer.value = accounts.value.reduce((total, account): any => {
      return (total += account.role === CUSTOMER_ROLE ? 1 : 0);
    }, 0);
  }
});

reportStore.getRevenueReport({ year: new Date().getFullYear() });
reportStore.getRentalFieldReport({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});
reportStore.getAccessoryReport({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});
userStore.getAccounts();
</script>

<template>
  <div class="home-page">
    <v-row>
      <v-col md="4">
        <admin-card-report
          class="card-report"
          title="Tổng số khách hàng"
          :value="totalCustomer"
          icon="mdi mdi-account-group"
          color="deep-purple"
        />
      </v-col>
      <v-col md="4">
        <admin-card-report
          class="card-report"
          :title="`Lượt đặt sân tháng ${new Date().getMonth() + 1}`"
          :value="totalFootballRented"
          icon="mdi mdi-soccer-field"
          color="teal"
        />
      </v-col>
      <v-col md="4">
        <admin-card-report
          class="card-report"
          :title="`Lượt thuê phụ kiện tháng ${new Date().getMonth() + 1}`"
          :value="totalAccessoryRented"
          icon="mdi mdi-application-cog-outline"
          color="amber"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12" class="revenue">
        <h3>Doanh thu năm {{ new Date().getFullYear() }}</h3>
        <common-chart-column-revenue
          v-if="revenueReport && revenueReport.length > 0"
          :data="revenueReport"
        />
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.revenue {
  margin: 20px 0;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.card-report {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>
