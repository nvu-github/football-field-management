<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { computed, defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, required: true, default: "" },
  format: {
    type: String,
    required: true,
  },
  isTimePicker: {
    type: Boolean,
    required: false,
    default: false,
  },
  isMonthPicker: {
    type: Boolean,
    required: false,
    default: false,
  },
  isYearPicker: {
    type: Boolean,
    required: false,
    default: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  messageError: {
    type: String,
    required: false,
    default: "",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isValid = ref<boolean>(false);

watch(vModel, function (newVal) {
  if (newVal) isValid.value = false;
});

function validDate() {
  if (!vModel.value) isValid.value = true;
  else isValid.value = false;
}
</script>

<template>
  <div class="date-picker">
    <VueDatePicker
      v-model="vModel"
      :format="props.format"
      :enable-time-picker="props.isTimePicker"
      :clear="false"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :month-picker="props.isMonthPicker"
      :year-picker="props.isYearPicker"
      @blur="validDate"
    />
    <span v-if="isValid && messageError" class="message"
      >{{ messageError }}
    </span>
  </div>
</template>
<style lang="scss" scoped>
.date-picker {
  :deep(.dp__clear_icon) {
    display: none;
  }
  :deep(.dp__input_wrap) > .dp__input {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #b4b2b2;
    &:focus {
      border-bottom: 2px solid #000;
    }
  }
  > .message {
    font-size: 12px;
    color: rgb(var(--v-theme-error));
  }
}
</style>
