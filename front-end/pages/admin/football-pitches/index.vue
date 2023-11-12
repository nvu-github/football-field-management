<script lang="ts" setup>
import { resolveComponent, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useFootballPitchStore, useDialogStore } from "~/stores";

const headers = [
  {
    title: "STT",
    align: "center",
    sortable: false,
    key: "sno",
  },
  { title: "Tên sân bóng", width: "30%", align: "start", key: "name" },
  { title: "Mô tả", width: "25%", align: "start", key: "description" },
  { title: "Loại sân", width: "15%", align: "start", key: "footballTypeName" },
  { title: "Trạng thái", width: "15%", align: "center", key: "status" },
  {
    title: "Tác vụ",
    width: "15%",
    align: "center",
    key: "actions",
    sortable: false,
  },
];
const appStore = useAppStore();
const footballPitchStore = useFootballPitchStore();
const dialogStore = useDialogStore();
const { app } = storeToRefs(appStore);
const { footballPitches } = storeToRefs(footballPitchStore);
app.value.title = "Quản lý sân bóng";

async function openDiaglogCreateFooballField() {
  await dialogStore.showDialog(
    resolveComponent("admin-football-pitch-dialog-football-pitch"),
    {
      title: "Thêm",
      action: "createFootballPitch",
    }
  );
}

async function openDiaglogUpdateFooballField(id: string) {
  await dialogStore.showDialog(
    resolveComponent("admin-football-pitch-dialog-football-pitch"),
    {
      id,
      title: "Cập nhật",
      action: "updateFootballPitch",
    }
  );
}

function openDiaglogConfirm(id: string) {
  dialogStore.showDialog(resolveComponent("common-dialog-confirm"), {
    store: footballPitchStore,
    action: "deleteFootballPitch",
    callback: "getFootballPitches",
    payload: {
      id,
    },
    message: {
      success: "Xóa sân bóng thành công",
      error: "Xóa sân bóng thất bại",
    },
    title: "Bạn có chắc chắn muốn xóa",
    button: {
      text: "Xóa",
      class: "-danger",
    },
  });
}

footballPitchStore.getFootballPitches();
</script>
<template>
  <div class="football-pitch-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <v-btn class="button -success" @click="openDiaglogCreateFooballField">
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
          <template #[`item.description`]="{ item }">
            <span v-html="item.raw.description"></span>
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              class="ma-2"
              :color="
                footballPitchStore.getColorStatusFootballPitch(item.raw.status)
              "
              text-color="white"
            >
              {{ footballPitchStore.getStatusFootballPitch(item.raw.status) }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              class="button -warning"
              @click="openDiaglogUpdateFooballField(item.raw.id)"
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
.football-pitch-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
