<script lang="ts" setup>
import loading from '~/public/ball-triangle.svg';
</script>
<template>
  <div class="loading text-center">
    <v-overlay
      :model-value="true"
      class="align-center justify-center"
      disabled
    >
      <v-img :src="loading" width="100" />
    </v-overlay>
  </div>
</template>