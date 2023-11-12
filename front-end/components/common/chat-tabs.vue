<script lang="ts" setup>
import { computed } from "vue";

const props: any = defineProps({
  vModel: {
    type: String,
    default: "",
  },
  tabs: {
    type: Array<ChatCustomerInfoForAdmin>,
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
  <v-tabs
    class="tab-component"
    v-model="vModel"
    direction="vertical"
    color="primary"
  >
    <v-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :value="tab.id"
      @click="handleChangeTab(tab.id)"
    >
      <v-icon start> mdi-account </v-icon>
      {{ tab.name }}
      <v-badge
        v-if="tab.totalUnread"
        color="error"
        :content="tab.totalUnread > 9 ? '9+' : tab.totalUnread"
        end
        inline
      ></v-badge>
    </v-tab>
  </v-tabs>
</template>
<style lang="scss" scoped>
.tab-component {
  :deep(.v-btn__content) {
    text-transform: none;
  }
}
</style>
