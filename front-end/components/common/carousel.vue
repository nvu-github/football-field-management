<script lang="ts" setup>
import { useRuntimeConfig } from "nuxt/app";

const runtimeConfig = useRuntimeConfig();
const props = defineProps({
  images: {
    type: Array<{
      url: string;
    }>,
    required: true,
  },
});
</script>

<template>
  <v-carousel class="carousel-component" hide-delimiters show-arrows="hover">
    <v-carousel-item
      v-for="(image, i) in props.images"
      :key="i"
      :src="`${runtimeConfig.public.API_URL}public/${image.url}`"
      cover
    ></v-carousel-item>
  </v-carousel>
</template>
<style lang="scss" scoped>
.carousel-component {
  :deep(.v-window__controls) > .v-btn {
    opacity: 0.4;
  }
}
</style>
