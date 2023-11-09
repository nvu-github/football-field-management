<script lang="ts" setup>
import { computed } from "vue";

const props: any = defineProps({
  vModel: {
    type: String,
    default: "",
  },
  tabs: {
    type: Array<{
      id: number;
      name: string;
    }>,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "handleChangeTab"]);

const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function handleChangeTab(id: number) {
  emit("handleChangeTab", id);
}
</script>
<template>
  <v-tabs v-model="vModel" direction="vertical" color="primary">
    <v-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :value="tab.id"
      @click="handleChangeTab(tab.id)"
    >
      <v-icon start> mdi-account </v-icon>
      {{ tab.name }}
    </v-tab>
  </v-tabs>
</template>
<style lang="scss" scoped></style>
