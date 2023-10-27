<script lang="ts" setup>
import defaultFootballImage from "~/public/logo.png";
import {
  useAppStore,
  useAccessoryStore,
  useAccessoryTypeStore,
} from "~/stores";
import { useRuntimeConfig } from "nuxt/app";

const appStore = useAppStore();
const accessoryStore = useAccessoryStore();
const runtimeConfig = useRuntimeConfig();
const accessoryTypeStore = useAccessoryTypeStore();
const { breadCrumbs } = storeToRefs(appStore);
const { accessories } = storeToRefs(accessoryStore);
const { accessoryTypes } = storeToRefs(accessoryTypeStore);

const accessoryTypeId = ref<number>();
const formattedAccessories = ref<ParamsAccessory>();

breadCrumbs.value = [
  {
    title: "Trang chủ",
    disabled: false,
    href: "/",
  },
  {
    title: "Phụ kiện",
    disabled: true,
    href: "/accessories",
  },
];

formattedAccessories.value = accessories.value;
function filterAccessory() {
  formattedAccessories.value = accessoryTypeId.value
    ? accessories.value.filter(
        (accessory) => accessory.accessoryTypeId === accessoryTypeId.value
      )
    : accessories.value;
}

accessoryTypeStore.getAccessoryTypes();
accessoryStore.getAccessories();
</script>
<template>
  <div class="accessory-page">
    <v-row class="row ml-1">
      <v-col md="3">
        <v-autocomplete
          v-model="accessoryTypeId"
          label="Loại phụ kiện"
          item-value="id"
          item-title="name"
          :items="accessoryTypes"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col class="action" md="2">
        <v-btn class="button -success" @click="filterAccessory">
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Tìm kiếm
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="formattedAccessories && formattedAccessories.length > 0">
      <v-col
        md="3"
        v-for="asccessory in formattedAccessories"
        :key="asccessory.id"
      >
        <user-accessory-card-info
          :id="asccessory.id"
          :name="asccessory.name"
          :price="asccessory.price"
          :typeId="asccessory.accessoryTypeId"
          :typeName="asccessory.accessoryTypeName"
          :avatar="
            asccessory.images.length > 0
              ? `${runtimeConfig.public.API_URL}public/${asccessory.images[0].url}`
              : defaultFootballImage
          "
        />
      </v-col>
    </v-row>
    <v-row class="empty" v-else> Không tìm thấy thông tin phụ kiện </v-row>
  </div>
</template>
<style lang="scss" scoped>
.accessory-page {
  > .row > .action {
    display: flex;
    align-items: center;
  }
}
</style>
