<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <v-card class="card-report" :color="props.color">
    <v-card-item class="item">
      <div class="title">
        <v-card-title class="mb-1">{{ props.value }}</v-card-title>
        <v-card-subtitle>{{ props.title }}</v-card-subtitle>
      </div>
      <div class="icon">
        <v-icon>{{ props.icon }}</v-icon>
      </div>
    </v-card-item>
  </v-card>
</template>
<style lang="scss" scoped>
.card-report {
  padding: 10px 15px;
  :deep(.v-card-item__content) {
    display: flex;
  }
  :deep(.v-card-item__content) > .title {
    width: 85%;
  }
  :deep(.v-card-item__content) > .icon > .v-icon {
    background: #bbbaba;
    color: #000;
    opacity: 0.5;
    padding: 20px;
    border-radius: 50%;
  }
}
</style>
