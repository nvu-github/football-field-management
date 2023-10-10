<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useLeasingDurationStore, useDialogStore } from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "Sno",
  },
  { title: "Thời gian bắt đầu", align: "center", key: "startTime" },
  { title: "Thời gian kết thúc", align: "center", key: "endTime" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const leasingDurationStore = useLeasingDurationStore();
const dialogStore = useDialogStore();
const { isDelete } = storeToRefs(dialogStore);
const { app } = storeToRefs(appStore);
const { leasingDurations } = storeToRefs(leasingDurationStore);
app.value.title = "Quản lý thời gian thuê";

watch(isDelete, async () => {
  await leasingDurationStore.getLeasingDurations();
  isDelete.value = false;
});

async function openDiaglogLeasingDuration(type?: string, id?: string) {
  await dialogStore.showDialog(
    resolveComponent("admins-football-field-dialog-leasing-duration"),
    {
      type: type,
      id,
    }
  );
}

function openDiaglogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    id,
    endpoint: `football-fields/leasing-durations/${id}`,
    nameObject: "thời gian thuê",
  });
}

leasingDurationStore.getLeasingDurations();
</script>
<template>
  <div class="leasing-duration-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDiaglogLeasingDuration">
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
          <template #[`item.Sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDiaglogLeasingDuration('update', item.raw.id)"
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
