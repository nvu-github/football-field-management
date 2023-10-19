<script lang="ts" setup>
import { isBefore, format } from "date-fns";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

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
});
const emit = defineEmits(["update:modelValue"]);

const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isValid = ref<boolean>(false);
const messageBefore = ref<string>("");

watch(vModel, function (newVal) {
  if (newVal) isValid.value = false;
  const isBeforeDate = isBefore(
    new Date(format(new Date(newVal), "dd/MM/yyyy")),
    new Date()
  );

  if (isBeforeDate)
    messageBefore.value = "Thời gian bạn chọn phải sau ngày hiện tại!";
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
      @blur="validDate"
    />
    <span v-if="isValid && messageError" class="message"
      >{{ messageError || messageBefore }} {{ messageBefore }}
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
