<script setup>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-vue";

const props = defineProps({
  modelValue: { type: String, required: false, default: "" },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  disabled: { type: Boolean, required: false },
});

const config = ref({
  placeholder: props.placeholder,
  removePlugins: ["EasyImage", "ImageUpload", "MediaEmbed"],
  editorconfig: {
    rows: 10,
  },
});
const emit = defineEmits(["update:modelValue"]);

const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div class="ck-editor">
    <CKEditor.component
      v-model="vModel"
      :editor="ClassicEditor"
      :config="config"
      :disabled="props.disabled"
    />
  </div>
</template>
<style lang="scss" scoped>
.ck-editor {
  :deep(.ck.ck-toolbar) {
    border-top: none;
    border-left: none;
    border-right: none;
  }
  :deep(.ck-rounded-corners) {
    border-left: none;
    border-right: none;
  }
}
</style>
