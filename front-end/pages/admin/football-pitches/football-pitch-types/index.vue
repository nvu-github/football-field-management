<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
  useAppStore,
  useFootballPitchTypeStore,
  useDialogStore,
} from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "Sno",
  },
  { title: "Tên loại sân bóng", width: "70%", align: "start", key: "name" },
  { title: "Tác vụ", align: "center", key: "actions", sortable: false },
];
const appStore = useAppStore();
const footballTypeStore = useFootballPitchTypeStore();
const dialogStore = useDialogStore();
const { isDelete } = storeToRefs(dialogStore);
const { app } = storeToRefs(appStore);
const { footballPitchTypes } = storeToRefs(footballTypeStore);
app.value.title = "Quản lý loại sân bóng";

watch(isDelete, async () => {
  await footballTypeStore.getFootballPitchTypes();
  isDelete.value = false;
});

async function openDiaglogLeasingDuration(type?: string, id?: string) {
  await dialogStore.showDialog(
    resolveComponent("admins-football-pitches-dialog-football-pitch-type"),
    {
      type: type,
      id,
    }
  );
}

function openDiaglogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    id,
    endpoint: `football-pitches/football-pitch-types/${id}`,
    nameObject: "loại sân bóng",
  });
}

footballTypeStore.getFootballPitchTypes();
</script>
<template>
  <div class="football-pitch-type-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDiaglogLeasingDuration">
          Thêm loại sân
          <template #prepend>
            <v-icon>mdi mdi-plus-box-outline</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="footballPitchTypes">
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
.football-pitch-type-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
