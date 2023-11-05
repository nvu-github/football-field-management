<script lang="ts" setup>
import defaultFootballImage from "~/public/logo.png";
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore, useAccessoryStore } from "~/stores";
import { useRuntimeConfig, useRoute } from "nuxt/app";
import { watch } from "fs";

const appStore = useAppStore();
const accessoryStore = useAccessoryStore();
const runtimeConfig = useRuntimeConfig();
const { breadCrumbs } = storeToRefs(appStore);
const { accessories } = storeToRefs(accessoryStore);
const route = useRoute();

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
  {
    title: route.query.name,
    disabled: true,
    href: "/search",
  },
];

await accessoryStore.getAccessories();
watchEffect(async () => {
  const { name } = route.query;
  if (name) {
    formattedAccessories.value = accessories.value.filter((accessory) => {
      return (
        name &&
        accessory.name.toLowerCase().includes(name.toString().toLowerCase())
      );
    });
  }
});
</script>
<template>
  <div class="accessory-page">
    <v-row>
      <v-col md="12 mt-3">
        <h2>Kết quả tìm kiếm phụ kiện: {{ route.query.name }}</h2>
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
