<script lang="ts" setup>
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useAccessoryTypeStore,
  useAppStore,
  useDialogStore,
} from "~/stores";

const rules = {
  name: (value: string) => !!value || "Vui lòng nhập tên loại phụ kiện",
};
const defaultTypeBtn = "update";
const accessoryTypeStore = useAccessoryTypeStore();
const appStore = useAppStore();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { AccessoryType } = storeToRefs(accessoryTypeStore);
const { dialog, closeDialog } = useDialogStore();
const { data }: any = dialog;
const paramsAccessoryType = ref<paramsAccessoryType>({
  name: "",
});

onBeforeMount(async () => {
  if (data.type === defaultTypeBtn) {
    await accessoryTypeStore.getAccessoryType(data.id);
    setAccessoryTypeToForm();
  }
});

function closeDialogAccessoryType() {
  closeDialog();
}

async function addAccessoryType() {
  const message = data.type === defaultTypeBtn ? "Cập nhật" : "Thêm";
  try {
    isLoading.value = true;

    if (data.type === defaultTypeBtn) {
      const action = accessoryTypeStore.updateAccessoryType(
        data.id,
        paramsAccessoryType.value
      );
      await action;
    } else {
      const action = accessoryTypeStore.createAccessoryType(
        paramsAccessoryType.value
      );
      await action;
    }

    $toast.success(`${message} loại sân bóng thành công`);
    await accessoryTypeStore.getAccessoryTypes();
  } catch (error) {
    console.log(error);
    $toast.error(`${message} loại sân bóng thất bại`);
  } finally {
    isLoading.value = false;
    closeDialog();
  }
}

function setAccessoryTypeToForm() {
  const { name }: any = AccessoryType.value;
  paramsAccessoryType.value.name = name;
}
</script>
<template>
  <div class="dialog-accessory-type-create">
    <v-form
      v-model="paramsAccessoryType.value"
      @submit.prevent="addAccessoryType"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >{{
              data && data.type === defaultTypeBtn ? "Cập nhật " : "Thêm "
            }}loại sân bóng</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="column" cols="12">
              <v-text-field
                v-model.trim="paramsAccessoryType.name"
                label="Tên loại phụ kiện*"
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
          <v-btn class="button -default" @click="closeDialogAccessoryType">
            Đóng
          </v-btn>
          <v-btn
            v-if="data && data.type !== 'update'"
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsAccessoryType.value"
          >
            Lưu
          </v-btn>
          <v-btn
            v-else
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsAccessoryType.value"
          >
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-accessory-type-create {
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
