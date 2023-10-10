<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
  useAppStore,
  useFootballPitchStore,
  useDialogStore,
  footballPitchStatuses,
} from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Tên sân bóng", align: "start", key: "name" },
  { title: "Mô tả", align: "start", key: "description" },
  { title: "Loại sân", align: "start", key: "footballTypeName" },
  { title: "Trạng thái", align: "start", key: "status" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const footballPitchStore = useFootballPitchStore();
const dialogStore = useDialogStore();
const { isDelete } = storeToRefs(dialogStore);
const { app } = storeToRefs(appStore);
const { footballPitches } = storeToRefs(footballPitchStore);
app.value.title = "Quản lý sân bóng";

watch(isDelete, async () => {
  await footballPitchStore.getFootballPitches();
  isDelete.value = false;
});

async function openDiaglogFooballField(type?: string, id?: string) {
  await dialogStore.showDialog(
    resolveComponent("admins-football-pitches-dialog-football-pitch"),
    {
      type: type,
      id,
    }
  );
}

function openDiaglogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    id,
    endpoint: `football-pitches/football-pitch/${id}`,
    nameObject: "loại sân bóng",
  });
}

function getColorStatusFootballPitch(status: string) {
  let color = "success";
  switch (status) {
    case "EMPTY":
      color = "primary";
      break;
    case "NOT_EMPTY":
      color = "orange";
      break;
  }
  return color;
}

footballPitchStore.getFootballPitches();
</script>
<template>
  <div class="football-field-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDiaglogFooballField">
          Thêm sân bóng
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="footballPitches">
          <template #[`item.sno`]="{ item }">
            {{ item.index + 1 }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              class="ma-2"
              :color="getColorStatusFootballPitch(item.raw.status)"
              text-color="white"
            >
              {{ footballPitchStatuses[item.raw.status] }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDiaglogFooballField('update', item.raw.id)"
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
.football-field-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
