<script lang="ts" setup>
// import { useDialogStore } from '~/store'
// const dialogStore = useDialogStore()
function closeDetail() {
  // dialogStore.closeDialog();
}
</script>

<template>
  <div class="accessory-detail">
    <v-card>
      <v-icon class="close" @click="closeDetail">mdi mdi-close-thick</v-icon>
        <v-card-title>
          <span class="text-h5"
            >Chi tiết phụ kiện</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <h1>Chi tiết phụ kiện</h1>
          </v-row>
        </v-card-text>
      </v-card>
  </div>
</template>
<style lang="scss" scoped>
.accessory-detail {
  position: relative;
  width: 400px;
  > .v-card {
    padding: 10px;
  }
  > .v-card > .v-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
}
</style>
