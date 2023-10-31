<script lang="ts" setup>
import { useDialogStore, useFootballPitchStore } from "~/stores";
import { formatPrice } from "~/utils/string";
import { storeToRefs } from "pinia";
const dialogStore = useDialogStore();
const footballPitchStore = useFootballPitchStore();
const { footballPitch } = storeToRefs(footballPitchStore);
const { data } = dialogStore.dialog;

function closeDetail() {
  dialogStore.closeDialog();
}
footballPitchStore.getFootballPitch(data.id);
</script>

<template>
  <div class="dialog-rental-detail">
    <v-card>
      <v-icon class="close" @click="closeDetail">mdi mdi-close-thick</v-icon>
      <v-card-title>
        <span class="text-h5">Thông tin sân bóng</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-if="footballPitch && footballPitch?.images.length > 0"
            md="6"
            class="image"
          >
            <common-carousel class="carousel" :images="footballPitch?.images" />
          </v-col>
          <v-col
            :md="footballPitch && footballPitch?.images.length > 0 ? 5 : 12"
            class="info"
          >
            <p class="name row mt-0">
              <b>Tên sân bóng: </b
              >{{ footballPitch ? footballPitch?.name : "" }}
            </p>
            <p class="type row">
              <b>Loại sân bóng: </b>
              <v-chip
                :color="
                  footballPitch && footballPitch.footballTypeId
                    ? 'primary'
                    : 'danger'
                "
                >{{
                  footballPitch ? footballPitch?.footballTypeId : ""
                }}</v-chip
              >
            </p>
            <!-- <p class="type row">
              <b>Trạng thái: </b>
              <v-chip
                :color="
                  accessory && accessory.amount > 0 ? 'success' : 'danger'
                "
                >{{
                  accessory && accessory.amount > 0 ? "Còn hàng" : "Hết hàng"
                }}</v-chip
              >
            </p> -->
            <p class="description row">
              <b class="label">Mô tả: </b
              ><span
                v-if="footballPitch"
                class="ml-2"
                v-html="footballPitch?.description"
              ></span>
            </p>
            <!-- <p class="price row">
              <b class="label">Giá thuê: </b
              >{{ footballPitch ? `${formatPrice(footballPitch?.price)} VNĐ` : "" }}
            </p> -->
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.dialog-rental-detail {
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
    color: #e60000;
    font-weight: bold;
  }
  :deep(.info) > .price > .label {
    color: #000;
    font-weight: 600;
  }
  :deep(.info) > .row {
    margin: 10px 0;
  }
}
.carousel {
  height: 200px !important;
}
</style>
