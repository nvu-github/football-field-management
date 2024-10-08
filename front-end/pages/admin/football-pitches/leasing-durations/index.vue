<script lang="ts" setup>
import { resolveComponent } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useLeasingDurationStore, useDialogStore } from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Thời gian bắt đầu", align: "center", key: "startTime" },
  { title: "Thời gian kết thúc", align: "center", key: "endTime" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const leasingDurationStore = useLeasingDurationStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { leasingDurations } = storeToRefs(leasingDurationStore);
app.value.title = "Quản lý thời gian thuê";

async function openDiaglogCreateLeasingDuration() {
  await dialogStore.showDialog(
    resolveComponent("admin-football-pitch-dialog-leasing-duration"),
    {
      title: "Thêm",
      action: "createLeasingDuration",
    }
  );
}

async function openDiaglogUpdateLeasingDuration(id: string) {
  await dialogStore.showDialog(
    resolveComponent("admin-football-pitch-dialog-leasing-duration"),
    {
      id,
      title: "Cập nhật",
      action: "updateLeasingDuration",
    }
  );
}

function openDiaglogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: leasingDurationStore,
    action: "deleteLeasingDuration",
    callback: "getLeasingDurations",
    payload: {
      id,
    },
    message: {
      success: "Xóa thời gian thuê sân thành công",
      error: "Xóa thời gian thuê sân thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

leasingDurationStore.getLeasingDurations();
</script>
<template>
  <div class="leasing-duration-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn
          class="button -success"
          @click="openDiaglogCreateLeasingDuration"
        >
          Thêm thời gian thuê
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="leasingDurations">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDiaglogUpdateLeasingDuration(item.raw.id)"
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              class="button -danger"
              @click="openDiaglogConfirm(item.raw.id)"
            >
              <v-icon> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.leasing-duration-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
  :deep(.v-data-table__td):last-child > .button {
    min-width: 40px;
    margin: 5px;
  }
}
</style>
