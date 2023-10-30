<script lang="ts" setup>
</script>
<template>
  <div class="user-personal-info">
    <v-row class="mt-2">
      <v-col md="6">
        <h1 class="title">Thông tin cá nhân</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <common-personal-info />
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.user-personal-info {
  > .v-row {
    justify-content: center;
  }
}
</style>
