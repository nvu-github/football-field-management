<script lang="ts" setup>
import { useNuxtApp, useRuntimeConfig } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useFootballPitchStore,
  useFootballPitchTypeStore,
  useAppStore,
  useDialogStore,
  footballPitchStatuses,
} from "~/stores";
import { generateId } from "~/utils/string";

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
const footballPitchStore = useFootballPitchStore();
const footballPitchTypeStore = useFootballPitchTypeStore();
const appStore = useAppStore();
const runtimeConfig = useRuntimeConfig();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { footballPitch } = storeToRefs(footballPitchStore);
const { footballPitchTypes } = storeToRefs(footballPitchTypeStore);
const { dialog, closeDialog } = useDialogStore();
const { data }: any = dialog;
const paramsFootballPitch = ref<ParamsFootballPitch>({
  name: "",
  description: "",
  status: "",
  images: [],
  footballTypeId: "",
});
const imagePreviews = ref<ImagePreview[]>([]);

onBeforeMount(async () => {
  if (data.type === defaultTypeBtn) {
    await footballPitchStore.getFootballPitch(data.id);
    setFootballPitchToForm();
  }
});

function closeDialogFootballPitch() {
  closeDialog();
}

async function addFootballPitch() {
  const message = data.type === defaultTypeBtn ? "Cập nhật" : "Thêm";
  try {
    isLoading.value = true;

    const images = await uploadFile();

    let paramsFootballPitchFormatted = {
      ...paramsFootballPitch.value,
      images: images.data,
    };
    const { footballTypeId, status } = paramsFootballPitch.value;

    if (data.type === defaultTypeBtn) {
      const foundFootballType = footballPitchTypes.value.find(
        (type) =>
          type.name.toLowerCase() === footballTypeId.toString().toLowerCase()
      )?.id;
      const foundFootballStatus = footballPitchStatuses.find(
        (fooballStatus: any) => {
          return fooballStatus.name.toLowerCase() === status.toLowerCase();
        }
      )?.key;

      paramsFootballPitchFormatted = {
        ...paramsFootballPitchFormatted,
        status: foundFootballStatus || status,
        footballTypeId: foundFootballType || footballTypeId,
      };
    }

    const action =
      data.type === defaultTypeBtn
        ? footballPitchStore.updateFootballPitch(
            data.id,
            paramsFootballPitchFormatted
          )
        : footballPitchStore.createFootballPitch(paramsFootballPitchFormatted);

    await action;

    $toast.success(`${message} sân bóng thành công`);
    await footballPitchStore.getFootballPitches();
  } catch (error) {
    console.log(error);
    $toast.error(`${message} sân bóng thất bại`);
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
    footballPitchStore.deleteImage(id);
  }
  imagePreviews.value = imagePreviews.value.filter(
    (image: any) => image.id !== id
  );
}

async function uploadFile() {
  const formData = new FormData();
  formData.append("type", "football-pitches");
  imagePreviews.value.forEach((image) => {
    if (typeof image.id !== "number") {
      formData.append(`files`, image.file);
    }
  });
  return await footballPitchStore.uploadImages(formData);
}

function setFootballPitchToForm() {
  const { name, description, status, images, footballTypeName }: any =
    footballPitch.value;
  paramsFootballPitch.value.name = name;
  paramsFootballPitch.value.description = description || "";
  paramsFootballPitch.value.footballTypeId = footballTypeName;
  paramsFootballPitch.value.status =
    footballPitchStore.getStatusFootballPitch(status);
  imagePreviews.value = images.map((image: any) => ({
    ...image,
    url: `${runtimeConfig.public.API_URL}public/${image.url}`,
  }));
}

footballPitchTypeStore.getFootballPitchTypes();
</script>
<template>
  <div class="dialog-football-pitch-create">
    <v-form
      v-model="paramsFootballPitch.value"
      @submit.prevent="addFootballPitch"
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
                v-model.trim="paramsFootballPitch.name"
                label="Tên loại sân*"
                type="text"
                variant="underlined"
                :rules="[rules.name]"
                required
              ></v-text-field>
              <common-text-editor
                class="mt-2 mb-3"
                v-model="paramsFootballPitch.description"
                placeholder="Mô tả"
              ></common-text-editor>
              <v-autocomplete
                v-model="paramsFootballPitch.status"
                label="Trạng thái*"
                item-value="key"
                item-title="name"
                :rules="[rules.status]"
                :items="footballPitchStatuses"
                variant="underlined"
              ></v-autocomplete>
              <v-autocomplete
                v-model="paramsFootballPitch.footballTypeId"
                label="Loại sân bóng*"
                item-value="id"
                item-title="name"
                :rules="[rules.type]"
                :items="footballPitchTypes"
                variant="underlined"
              ></v-autocomplete>
              <v-file-input
                v-model="paramsFootballPitch.images"
                accept="image/*"
                type="file"
                prepend-icon="mdi-camera"
                variant="underlined"
                label="Ảnh sân bóng"
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
          <v-btn class="button -default" @click="closeDialogFootballPitch">
            Đóng
          </v-btn>
          <v-btn
            v-if="data && data.type !== 'update'"
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsFootballPitch.value"
          >
            Lưu
          </v-btn>
          <v-btn
            v-else
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsFootballPitch.value"
          >
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-football-pitch-create {
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
