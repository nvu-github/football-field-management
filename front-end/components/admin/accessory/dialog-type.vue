<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import { useAccessoryTypeStore, useAppStore, useDialogStore } from "~/stores";

const rules = {
  name: (value: string) => !!value || "Vui lòng nhập tên loại phụ kiện",
};
const accessoryTypeStore: any = useAccessoryTypeStore();
const appStore = useAppStore();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { accessoryType } = storeToRefs(accessoryTypeStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const paramsAccessoryType = ref<ParamsAccessoryType>({
  name: "",
});

onBeforeMount(async () => {
  if (id) {
    await accessoryTypeStore.getAccessoryType(id);
    setAccessoryTypeToForm();
  }
});

function closeDialogAccessoryType() {
  closeDialog();
}

async function addAccessoryType() {
  try {
    paramsAccessoryType.value = id
      ? { ...paramsAccessoryType.value, id }
      : paramsAccessoryType.value;
    await accessoryTypeStore[action](paramsAccessoryType.value);
    $toast.success(`${title} loại phụ kiện thành công`);
    await accessoryTypeStore.getAccessoryTypes();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} loại phụ kiện thất bại`);
  } finally {
    closeDialog();
  }
}

function setAccessoryTypeToForm() {
  const { name }: any = accessoryType.value;
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
          <span class="text-h5">{{ title }} loại phụ kiện</span>
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
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsAccessoryType.value"
          >
            {{ title }}
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
