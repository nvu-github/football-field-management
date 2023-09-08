<script lang="ts" setup>
// import { useVuelidate } from "@vuelidate/core";

const props = defineProps({
  vModel: {
    type: String,
    default: "",
  },
  rules: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  slot: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);

const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <v-text-field
    v-model="vModel"
    class="input"
    :class="{
      '-error': !vModel,
    }"
    :rules="props.rules"
    :placeholder="props.placeholder"
    hide-details="auto"
    :variant="props.variant"
  >
    <template #[props.slot]>
      <slot />
    </template>
  </v-text-field>
</template>
<style lang="scss" scoped>
.input {
  :deep(.v-field__field) > .v-field__input {
    padding: 5px 10px;
    border: 1px solid #a9ca31;
    border-radius: 5px;
    --v-field-input-min-height: 0;

    &:focus {
      outline: none;
      border: 2px solid #a9ca31;
    }
  }
  &:focus {
    box-shadow: none;
  }
}

// .input.-error {
//   :deep(.v-field__field) > .v-field__input {
//     border: 1px solid #ff0000;
//   }
// }
</style>
