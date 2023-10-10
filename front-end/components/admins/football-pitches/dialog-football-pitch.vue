<script lang="ts" setup>
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useFootballPitchStore,
  useFootballPitchTypeStore,
  useAppStore,
  useDialogStore,
} from "~/stores";

const rules = {
  name: (value: string) => {
    if (!value) return "Vui lòng nhập tên sân bóng!";
    return true;
  },
  status: (value: string) => {
    if (!value) return "Vui lòng chọn trạng thái!";
    return true;
  },
  type: (value: string) => {
    if (!value) return "Vui lòng chọn loại sân bóng!";
    return true;
  },
  images: (value: string) => {
    if (!value) return "Vui lòng chọn ảnh sân bóng!";
    return true;
  },
};
const defaultTypeBtn = "update";
const footballFieldStore = useFootballPitchStore();
const footballFieldTypeStore = useFootballPitchTypeStore();
const appStore = useAppStore();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { footballPitch } = storeToRefs(footballFieldStore);
const { footballPitchTypes } = storeToRefs(footballFieldTypeStore);
const { dialog, closeDialog } = useDialogStore();
const { data }: any = dialog;
const paramsFootballField = ref<ParamsFootballField>({
  name: "",
  description: "",
  status: "",
  images: [],
  typeId: "",
});

onBeforeMount(async () => {
  if (data.type === defaultTypeBtn) {
    await footballFieldStore.getFootballPitch(data.id);
    setFootballPitchToForm();
  }
});

function closeDialogFootballField() {
  closeDialog();
}

async function addFootballField() {
  isLoading.value = true;
  try {
    if (data.type === defaultTypeBtn) {
      await footballFieldStore.updateFootballPitch(
        data.id,
        paramsFootballField.value
      );
    } else {
      await footballFieldStore.createFootballPitch(paramsFootballField.value);
    }
    $toast.success(
      `${
        data.type === defaultTypeBtn ? "Cập nhật" : "Thêm"
      } loại sân bóng thành công`
    );
    await footballFieldStore.getFootballPitchs();
  } catch (error) {
    console.log(error);
    $toast.error(
      `${
        data.type === defaultTypeBtn ? "Cập nhật" : "Thêm"
      } loại sân bóng thất bại`
    );
  }
  isLoading.value = false;
  closeDialog();
}

function getFileInput() {
  console.log(1);
}

function setFootballPitchToForm() {
  const { name }: any = footballPitch.value;
  paramsFootballField.value.name = name;
}

footballFieldTypeStore.getFootballPitchTypes();
</script>
<template>
  <div class="dialog-football-field-create">
    <v-form
      v-model="paramsFootballField.value"
      @submit.prevent="addFootballField"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >{{
              data && data.type === defaultTypeBtn ? "Cập nhật " : "Thêm "
            }}sân bóng</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.trim="paramsFootballField.name"
                label="Tên loại sân*"
                type="text"
                variant="underlined"
                :rules="[rules.name]"
                required
              ></v-text-field>
              <v-textarea
                v-model.trim="paramsFootballField.desciption"
                label="Mô tả"
                type="text"
                variant="underlined"
                required
              ></v-textarea>
              <v-autocomplete
                v-model="paramsFootballField.status"
                label="Trạng thái*"
                item-value="id"
                item-title="name"
                :rules="[rules.status]"
                :items="[
                  { id: 1, name: 'Trống' },
                  { id: 2, name: 'Đang thuê' },
                  { id: 3, name: 'Đang bảo trì' },
                ]"
                variant="underlined"
              ></v-autocomplete>
              <v-autocomplete
                v-model="paramsFootballField.typeId"
                label="Loại sân bóng*"
                item-value="id"
                item-title="name"
                :rules="[rules.type]"
                :items="footballPitchTypes"
                variant="underlined"
              ></v-autocomplete>
              <v-file-input
                :rules="paramsFootballField.images"
                accept="image/png, image/jpeg"
                prepend-icon="mdi-camera"
                variant="underlined"
                label="Ảnh sân bóng"
                multiple
                @change="getFileInput"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogFootballField">
            Đóng
          </v-btn>
          <v-btn
            v-if="data && data.type !== 'update'"
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsFootballField.value"
          >
            Lưu
          </v-btn>
          <v-btn
            v-else
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsFootballField.value"
          >
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-football-field-create {
  width: 500px;

  :deep(.v-card) {
    padding: 5px;
  }
}
</style>
