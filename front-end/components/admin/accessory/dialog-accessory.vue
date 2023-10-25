<script lang="ts" setup>
import { ref } from "vue";
import { useNuxtApp, useRuntimeConfig } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useAccessoryStore,
  useAccessoryTypeStore,
  useAppStore,
  useDialogStore,
} from "~/stores";
import { generateId, formatPrice } from "~/utils/string";

const rules = {
  name: (value: string) => {
    if (!value) return "Vui lòng thêm tên phụ kiện!";
    return true;
  },
  amount: (value: number) => {
    if (!value) return "Vui lòng thêm số lượng!";
    if (Number(value) < 0) return "Vui lòng không nhập số âm!";
    if (!Number.isInteger(Number(value))) return "Vui lòng chỉ nhập số nguyên!";
    return true;
  },
  price: (value: number) => {
    if (!value) return "Vui lòng thêm giá phụ kiện!";
    if (Number(value) < 0) return "Vui lòng không nhập số âm!";
    if (!Number.isFinite(Number(value))) return "Vui lòng chỉ nhập số!";
    return true;
  },
  images: (value: string) => {
    if (!value) return "Vui lòng chọn ảnh phụ kiện!";
    return true;
  },
  type: (value: string) => {
    if (!value) return "Vui lòng chọn loại phụ kiện!";
    return true;
  },
};
const defaultTypeBtn = "update";
const accessoryStore = useAccessoryStore();
const accessoryTypeStore = useAccessoryTypeStore();
const appStore = useAppStore();
const runtimeConfig = useRuntimeConfig();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { accessory } = storeToRefs(accessoryStore);
const { accessoryTypes } = storeToRefs(accessoryTypeStore);
const { dialog, closeDialog } = useDialogStore();
const { data }: any = dialog;
const paramsAccessory = ref<ParamsAccessory>({
  name: "",
  description: "",
  amount: null,
  price: null,
  images: [],
  accessoryTypeId: null,
});

const imagePreviews = ref<ImagePreview[]>([]);
const formattedPrice = computed({
  get: () => {
    if (paramsAccessory.value.price) {
      return formatPrice(paramsAccessory.value.price);
    }
    return null;
  },
  set: (value) => {
    if (value) {
      paramsAccessory.value.price = parseInt(value.replace(/\./g, ""), 10);
    }
  },
});

onBeforeMount(async () => {
  if (data.type === defaultTypeBtn) {
    await accessoryStore.getAccessory(data.id);
    setAccessoryToForm();
  }
});

function closeDialogAccessory() {
  closeDialog();
}

async function addAccessory() {
  const message = data.type === defaultTypeBtn ? "Cập nhật" : "Thêm";
  try {
    isLoading.value = true;

    const images = await uploadFile();

    let paramsAccessoryFormatted = {
      ...paramsAccessory.value,
      images: images.data,
    };
    const { accessoryTypeId } = paramsAccessory.value;

    if (data.type === defaultTypeBtn) {
      const foundAccessoryType = accessoryTypes.value.find(
        (type) =>
          type.name.toLowerCase() === accessoryTypeId.toString().toLowerCase()
      )?.id;

      paramsAccessoryFormatted = {
        ...paramsAccessoryFormatted,
        accessoryTypeId: foundAccessoryType || accessoryTypeId,
      };
    }

    const action =
      data.type === defaultTypeBtn
        ? accessoryStore.updateAccessory(data.id, paramsAccessoryFormatted)
        : accessoryStore.createAccessory(paramsAccessoryFormatted);

    await action;

    $toast.success(`${message} phụ kiện thành công`);
    await accessoryStore.getAccessories();
  } catch (error) {
    console.log(error);
    $toast.error(`${message} phụ kiện thất bại`);
  } finally {
    isLoading.value = false;
    closeDialog();
  }
}

async function getFileInput(e: any) {
  const files = e.target.files;
  Array.from(files).forEach((image: any) => {
    imagePreviews.value.push({
      id: generateId(),
      file: image,
      url: URL.createObjectURL(image),
    });
  });
}

function deleteImage(id: string) {
  if (typeof id === "number") {
    accessoryStore.deleteImage(id);
  }
  imagePreviews.value = imagePreviews.value.filter(
    (image: any) => image.id !== id
  );
}

async function uploadFile() {
  const formData = new FormData();
  formData.append("type", "accessories");
  imagePreviews.value.forEach((image) => {
    if (typeof image.id !== "number") {
      formData.append(`files`, image.file);
    }
  });
  return await appStore.uploadImages(formData);
}

function setAccessoryToForm() {
  const { name, description, images, amount, price, accessoryName }: any =
    accessory.value;
  paramsAccessory.value.name = name;
  paramsAccessory.value.description = description || "";
  paramsAccessory.value.accessoryTypeId = accessoryName;
  paramsAccessory.value.amount = amount;
  paramsAccessory.value.price = price;
  imagePreviews.value = images.map((image: any) => ({
    ...image,
    url: `${runtimeConfig.public.API_URL}public/${image.url}`,
  }));
}

accessoryTypeStore.getAccessoryTypes();
</script>
<template>
  <div class="dialog-accessory-create">
    <v-form v-model="paramsAccessory.value" @submit.prevent="addAccessory">
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >{{
              data && data.type === defaultTypeBtn ? "Cập nhật " : "Thêm "
            }}phụ kiện</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.trim="paramsAccessory.name"
                label="Tên phụ kiện*"
                type="text"
                variant="underlined"
                :rules="[rules.name]"
                required
              ></v-text-field>
              <common-text-editor
                class="mt-2 mb-3"
                v-model="paramsAccessory.description"
                placeholder="Mô tả"
              ></common-text-editor>
              <v-row>
                <v-col md="6">
                  <v-text-field
                    v-model.trim="paramsAccessory.amount"
                    label="Số lượng*"
                    type="number"
                    variant="underlined"
                    :rules="[rules.amount]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    v-model.trim="formattedPrice"
                    label="Giá phụ kiện (VNĐ)*"
                    type="text"
                    variant="underlined"
                    :rules="[rules.price]"
                    required
                  >
                    <template #append> VNĐ </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-autocomplete
                v-model="paramsAccessory.accessoryTypeId"
                label="Loại phụ kiện*"
                item-value="id"
                item-title="name"
                :rules="[rules.type]"
                :items="accessoryTypes"
                variant="underlined"
              ></v-autocomplete>
              <v-file-input
                v-model="paramsAccessory.images"
                accept="image/*"
                type="file"
                prepend-icon="mdi-camera"
                variant="underlined"
                label="Ảnh phụ kiện"
                multiple
                @change="getFileInput"
              ></v-file-input>
              <v-row v-if="imagePreviews.length > 0">
                <v-col
                  v-for="(image, index) in imagePreviews"
                  :key="index"
                  md="3"
                >
                  <div class="image-preview">
                    <v-img :src="image.url" class="image" />
                    <v-icon class="delete" @click="deleteImage(image.id)"
                      >mdi mdi-close-thick</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogAccessory">
            Đóng
          </v-btn>
          <v-btn
            v-if="data && data.type !== 'update'"
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsAccessory.value"
          >
            Lưu
          </v-btn>
          <v-btn
            v-else
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsAccessory.value"
          >
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-accessory-create {
  width: 700px;

  :deep(.v-card) {
    padding: 5px;
  }

  :deep(.ck-content) {
    height: 100px;
  }
}

.image-preview {
  position: relative;
  height: 100px;
  width: 100%;
  > .delete {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 5px;
    right: 5px;
    padding: 15px;
    border-radius: 5px;
    background: rgb(212, 209, 209);
    cursor: pointer;

    &:hover {
      background: rgb(187, 185, 185);
    }
  }
}
</style>
