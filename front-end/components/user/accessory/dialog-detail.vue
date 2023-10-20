<script lang="ts" setup>
import { useDialogStore, useAccessoryStore } from "~/stores";
import { formatPrice } from "~/utils/string";
import { storeToRefs } from "pinia";
const dialogStore = useDialogStore();
const accessoryStore = useAccessoryStore();
const { accessory } = storeToRefs(accessoryStore);
const { data } = dialogStore.dialog;

function closeDetail() {
  dialogStore.closeDialog();
}

accessoryStore.getAccessory(data.id);
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
          <v-col
            v-if="accessory && accessory?.images.length > 0"
            md="6"
            class="image"
          >
            <common-carousel class="carousel" :images="accessory?.images" />
          </v-col>
          <v-col
            :md="accessory && accessory?.images.length > 0 ? 5 : 12"
            class="info"
          >
            <p class="name">
              <b>Tên phụ kiện: </b>{{ accessory ? accessory?.name : "" }}
            </p>
            <p class="description">
              <b class="label">Mô tả: </b
              ><span
                v-if="accessory"
                class="ml-2"
                v-html="accessory?.description"
              ></span>
            </p>
            <p class="price">
              <b class="label">Giá thuê: </b
              >{{ accessory ? `${formatPrice(accessory?.price)} VNĐ` : "" }}
            </p>
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
  :deep(.info) > .description {
    display: flex;
  }
  :deep(.info) > .price {
    color: rgb(209, 32, 32);
    font-weight: bold;
  }
  :deep(.info) > .price > .label {
    color: #000;
  }
}
.carousel {
  height: 200px !important;
}
</style>
