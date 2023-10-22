<script lang="ts" setup>
import { useAppStore, useAccessoryStore } from "~/stores";
import { useRuntimeConfig } from "nuxt/app";

const appStore = useAppStore();
const accessoryStore = useAccessoryStore();
const runtimeConfig = useRuntimeConfig();
const { breadCrumbs } = storeToRefs(appStore);
const { accessories } = storeToRefs(accessoryStore);
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

accessoryStore.getAccessories();
</script>
<template>
  <div class="accessory-page">
    <v-row class="row ml-1">
      <v-col md="3">
        <v-autocomplete
          label="Loại phụ kiện"
          :items="[
            'California',
            'Colorado',
            'Florida',
            'Georgia',
            'Texas',
            'Wyoming',
          ]"
          variant="underlined"
        ></v-autocomplete>
      </v-col>
      <v-col class="action" md="2">
        <v-btn class="button -success">
          <template #prepend>
            <v-icon>mdi mdi-magnify</v-icon>
          </template>
          Tìm kiếm
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md="3"
        v-for="asccessory in accessories.slice(0, 6)"
        :key="asccessory.id"
      >
        <user-accessory-card-info
          :id="asccessory.id"
          :name="asccessory.name"
          :price="asccessory.price"
          :typeId="asccessory.accessoryType.id"
          :typeName="asccessory.accessoryType.name"
          :avatar="`${runtimeConfig.public.API_URL}public/${asccessory.accessoryImage[0].url}`"
        />
      </v-col>
    </v-row>
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
