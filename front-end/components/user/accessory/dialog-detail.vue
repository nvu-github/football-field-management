<script lang="ts" setup>
import { useDialogStore } from "~/stores";
const dialogStore = useDialogStore();
const items = [
  {
    src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
  },
  {
    src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
  },
  {
    src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
  },
  {
    src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
  },
];
function closeDetail() {
  dialogStore.closeDialog();
}
</script>

<template>
  <div class="accessory-detail">
    <v-card>
      <v-icon class="close" @click="closeDetail">mdi mdi-close-thick</v-icon>
      <v-card-title>
        <span class="text-h5">Thông tin phụ kiện</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="7" class="image">
            <v-carousel class="carousel" hide-delimiters>
              <v-carousel-item
                v-for="(item, i) in items"
                :key="i"
                :src="item.src"
                cover
              ></v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col md="4" class="info">
            <p class="name"><b>Tên phụ kiện:</b></p>
            <p class="description"><b>Mô tả:</b></p>
            <p class="name"><b>Giá thuê:</b></p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.accessory-detail {
  position: relative;
  width: 800px;
  > .v-card {
    padding: 10px;
  }
  > .v-card > .v-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
}
.carousel {
  height: 300px !important;
}
</style>
