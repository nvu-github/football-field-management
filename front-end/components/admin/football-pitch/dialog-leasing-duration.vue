<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { useNuxtApp } from "nuxt/app";
import { compareTime, parseTime } from "~/utils/string";
import { storeToRefs } from "pinia";
import { useLeasingDurationStore, useAppStore, useDialogStore } from "~/stores";

const rules = {
  startTime: (value: string) => {
    if (!value) return "Vui lòng nhập thời gian bắt đầu!";
    return true;
  },
  endTime: (value: string) => {
    const { startTime } = paramsLeasingDuration.value;

    if (!value) return "Vui lòng nhập thời gian kết thúc!";
    if (!compareTime(startTime, value))
      return "Thời gian bắt đầu phải trước thời gian kết thúc!";
    return true;
  },
};
const leasingDurationStore: any = useLeasingDurationStore();
const appStore = useAppStore();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { leasingDurations, leasingDuration } = storeToRefs(leasingDurationStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const paramsLeasingDuration = ref<ParamsLeasingDuration>({
  startTime: "",
  endTime: "",
});

onBeforeMount(async () => {
  if (id) {
    await leasingDurationStore.getLeasingDuration(id);
    setLeasingDurationToForm();
  }
});

function closeDialogLeasingDuration() {
  closeDialog();
}

async function addLeasingDuration() {
  try {
    if (isValidTime()) {
      return $toast.error(`Khoảng thời gian thuê này đã tồn tại`);
    }

    paramsLeasingDuration.value = id
      ? { ...paramsLeasingDuration.value, id }
      : paramsLeasingDuration.value;
    await leasingDurationStore[action](paramsLeasingDuration.value);
    $toast.success(`${title} thời gian thuê thành công`);
    await leasingDurationStore.getLeasingDurations();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} thời gian thuê thất bại`);
  } finally {
    closeDialog();
  }
}

function isValidTime() {
  const { startTime, endTime } = paramsLeasingDuration.value;
  return leasingDurations.value.some((leasingDuration: any) => {
    const currentStartTime = parseTime(startTime);
    const currentEndTime = parseTime(endTime);
    const leasingDurationStartTime = parseTime(leasingDuration.startTime);
    const leasingDurationEndTime = parseTime(leasingDuration.endTime);

    return (
      leasingDurationStartTime <= currentStartTime &&
      leasingDurationEndTime >= currentEndTime
    );
  });
}

function setLeasingDurationToForm() {
  const { startTime, endTime }: any = leasingDuration.value;
  paramsLeasingDuration.value.startTime = startTime;
  paramsLeasingDuration.value.endTime = endTime;
}
</script>
<template>
  <div class="dialog-leasing-duration-create">
    <v-form
      v-model="paramsLeasingDuration.value"
      @submit.prevent="addLeasingDuration"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} thời gian thuê</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="column" cols="12">
                <v-text-field
                  v-model.trim="paramsLeasingDuration.startTime"
                  label="Thời gian bắt đầu*"
                  type="time"
                  variant="underlined"
                  :rules="[rules.startTime]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="paramsLeasingDuration.endTime"
                  label="Thời gian kết thúc*"
                  type="time"
                  variant="underlined"
                  :rules="[rules.endTime]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogLeasingDuration">
            Đóng
          </v-btn>
          <v-btn
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsLeasingDuration.value"
          >
            {{ title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-leasing-duration-create {
  width: 500px;

  :deep(.v-card) {
    padding: 5px;
  }

  :deep(.column) {
    display: flex;
  }

  :deep(.column) > .v-input {
    margin: 0 25px;
  }
}
</style>
