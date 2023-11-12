<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useNuxtApp, useRoute, useRuntimeConfig } from "nuxt/app";
import {
  useDialogStore,
  useFootballPitchStore,
  useAppStore,
  useEvaluationStore,
} from "~/stores";
import { formatPrice, generateId } from "~/utils/string";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const appStore = useAppStore();
const dialogStore = useDialogStore();
const footballPitchStore = useFootballPitchStore();
const evaluationStore = useEvaluationStore();
const { $toast }: any = useNuxtApp();
const { footballPitch } = storeToRefs(footballPitchStore);
const { evaluation } = storeToRefs(evaluationStore);
const { id, title, action, actionReload }: any = dialogStore.dialog.data;
const columnSizeWithImage = 5;
const columnSizeNotImage = 12;
const payloadEvaluation = ref<Evaluation>({
  score: 5,
  content: "",
  image: null,
});
const imagePreviews = ref<ImagePreview[]>([]);

onBeforeMount(async () => {
  if (id) {
    await evaluationStore.getEvaluation(id);
    setEvaluationToForm();
  }
});

async function actionEvaluation() {
  try {
    const images = await uploadFile();

    let payloadEvaluationFormatted = {
      ...payloadEvaluation.value,
      image: images.data,
      footballPitchId: Number(route.params.id),
    };

    payloadEvaluationFormatted = id
      ? { ...payloadEvaluationFormatted, id }
      : payloadEvaluationFormatted;
    await evaluationStore[action](payloadEvaluationFormatted);
    $toast.success(`${title} đánh giá thành công`);
    if (route.params.id) {
      await footballPitchStore[actionReload](route.params.id);
    } else {
      await footballPitchStore[actionReload]();
    }
  } catch (error) {
    console.log(error);
    $toast.error(`${title} đánh giá thất bại`);
  } finally {
    closeDialogCreateEvaluation();
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
  imagePreviews.value = imagePreviews.value.filter(
    (image: any) => image.id !== id
  );
}

async function uploadFile() {
  const formData = new FormData();
  formData.append("type", "evaluation");
  imagePreviews.value.forEach((image) => {
    if (typeof image.id !== "number") {
      formData.append(`files`, image.file);
    }
  });
  return await appStore.uploadImages(formData);
}

function setEvaluationToForm() {
  const { score, content, image } = evaluation.value;
  payloadEvaluation.value.score = score;
  payloadEvaluation.value.content = content;
  payloadEvaluation.value.image = image;
  imagePreviews.value = image.map((image: any) => ({
    ...image,
    url: `${runtimeConfig.public.API_URL}public/${image.url}`,
  }));
}

function closeDialogCreateEvaluation() {
  dialogStore.closeDialog();
}
</script>
<template>
  <div class="dialog-create-evaluation">
    <v-form
      v-model="payloadEvaluation.value"
      @submit.prevent="actionEvaluation"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} đánh giá</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="column" cols="12">
              <div class="rate">
                <span class="label"> Chất lượng sân bóng: </span>
                <v-rating
                  v-model="payloadEvaluation.score"
                  color="orange-lighten-1"
                  active-color="blue"
                />
                <span class="text">
                  <v-chip
                    class="ma-2"
                    label
                    :color="
                      evaluationStore.getScoreText(payloadEvaluation.score)
                        .color
                    "
                  >
                    {{
                      evaluationStore.getScoreText(payloadEvaluation.score).text
                    }}
                  </v-chip>
                </span>
              </div>
              <common-text-editor
                v-model="payloadEvaluation.content"
                class="mt-2 mb-3"
                placeholder="Đánh giá của bạn về sân bóng"
              ></common-text-editor>
              <v-file-input
                v-model="payloadEvaluation.image"
                accept="image/*"
                type="file"
                prepend-icon="mdi-camera"
                variant="underlined"
                label="Ảnh đánh giá"
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
          <v-btn class="button -default" @click="closeDialogCreateEvaluation">
            Đóng
          </v-btn>
          <v-btn
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!payloadEvaluation.value"
          >
            {{ title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-create-evaluation {
  position: relative;
  width: 800px;
  > .v-card {
    padding: 10px;
  }
  > .v-card > .v-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
  :deep(.rate) {
    display: flex;
    align-items: center;
  }
  :deep(.rate) > .label {
    margin-right: 20px;
  }
  :deep(.rate) > .text {
    margin-top: 5px;
    margin-left: 10px;
  }
  :deep(.ck-content) {
    height: 200px;
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
    right: 20px;
    padding: 15px;
    border-radius: 5px;
    background: rgb(212, 209, 209);
    cursor: pointer;

    &:hover {
      background: rgb(187, 185, 185);
    }
  }
}

.carousel {
  height: 200px !important;
}
</style>
