<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useFootballPitchTypeStore,
  useAppStore,
  useDialogStore,
} from "~/stores";

const rules = {
  name: (value: string) => !!value || "Vui lòng nhập tên loại sân",
};
const footballFieldTypeStore: any = useFootballPitchTypeStore();
const appStore = useAppStore();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { footballPitchType }: any = storeToRefs(footballFieldTypeStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const paramsFootballFieldType = ref<ParamsFootballFieldType>({
  name: "",
});

onBeforeMount(async () => {
  if (id) {
    await footballFieldTypeStore.getFootballPitchType(id);
    setFootballFieldTypeToForm();
  }
});

function closeDialogFootballFieldType() {
  closeDialog();
}

async function addFootballFieldType() {
  try {
    paramsFootballFieldType.value = id
      ? { ...paramsFootballFieldType.value, id }
      : paramsFootballFieldType.value;
    await footballFieldTypeStore[action](paramsFootballFieldType.value);
    $toast.success(`${title} loại sân bóng thành công`);
    await footballFieldTypeStore.getFootballPitchTypes();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} loại sân bóng thất bại`);
  } finally {
    closeDialog();
  }
}

function setFootballFieldTypeToForm() {
  const { name }: any = footballPitchType.value;
  paramsFootballFieldType.value.name = name;
}
</script>
<template>
  <div class="dialog-football-pitch-type-create">
    <v-form
      v-model="paramsFootballFieldType.value"
      @submit.prevent="addFootballFieldType"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} loại sân bóng</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="column" cols="12">
              <v-text-field
                v-model.trim="paramsFootballFieldType.name"
                label="Tên loại sân*"
                type="text"
                variant="underlined"
                :rules="[rules.name]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogFootballFieldType">
            Đóng
          </v-btn>
          <v-btn
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsFootballFieldType.value"
          >
            {{ title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-football-pitch-type-create {
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
