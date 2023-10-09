<script lang="ts" setup>
import logo from "~/public/logo.png";
import { storeToRefs } from "pinia";
import { useRoute } from "nuxt/app";
import { useAppStore } from "~/stores";

const appStore = useAppStore();
const route = useRoute();
const { isShowSidebar } = storeToRefs(appStore);

const menus = ref<Menu>([
  {
    icon: "mdi-home",
    title: "Trang chủ",
    url: "/admin/",
  },
  {
    icon: "mdi-account",
    title: "Quản lý người dùng",
    url: "/admin/users",
    subMenus: [
      {
        icon: "mdi mdi-account-box-outline",
        title: "Quản lý tài khoản",
        url: "/admin/users",
      },
    ],
  },
  {
    icon: "mdi mdi-soccer-field",
    title: "Quản lý sân bóng",
    url: "/admin/football-fields",
    subMenus: [
      {
        icon: "mdi mdi-soccer",
        title: "Sân bóng",
        url: "/admin/football-fields",
      },
      {
        icon: "mdi mdi-cog",
        title: "Giá thuê sân",
        url: "/admin/football-fields/prices",
      },
      {
        icon: "mdi mdi-clock-time-three-outline",
        title: "Thời gian thuê",
        url: "/admin/football-fields/leasing-durations",
      },
      {
        icon: "mdi mdi-format-list-bulleted-type",
        title: "Loại sân bóng",
        url: "/admin/football-fields/football-field-types",
      },
    ],
  },
]);
function closeNavbar() {
  // drawer.value = false;
}
</script>
<template>
  <v-navigation-drawer
    v-model="isShowSidebar"
    @click="rail = false"
    class="navigationadmin"
  >
    <v-list-item nav class="info">
      <img :src="logo" alt="logo" class="logo" width="70" />
      <div class="title">
        Sân bóng <br />
        Hoàng Quân
      </div>
      <template #append>
        <v-icon class="icon" @click="closeNavbar"> mdi mdi-close-thick </v-icon>
      </template>
    </v-list-item>

    <v-list density="compact" nav>
      <div v-for="(menu, index) in menus" :key="index" class="menu">
        <v-list-item
          v-if="!menu.subMenus"
          link
          :prepend-icon="menu.icon"
          :title="menu.title"
          :to="menu.url"
          :active="route.path === menu.url"
          :value="menu.url"
        ></v-list-item>
        <v-list-group v-else>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="menu.icon"
              :title="menu.title"
              :value="menu.url"
            ></v-list-item>
          </template>
          <v-list-item
            v-for="(subMenu, indexSub) in menu.subMenus"
            link
            :key="indexSub"
            :title="subMenu.title"
            :prepend-icon="subMenu.icon"
            :to="subMenu.url"
            :value="subMenu.url"
          ></v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.navigationadmin {
  :deep(.v-list-item__append) > .icon {
    display: none;
  }
  :deep(.v-list-item__append) > .v-icon {
    margin-inline-start: 10px;
  }
  :deep(.v-navigation-drawer__content) > .info {
    padding: 10px;
  }
  :deep(.v-list-item__content) {
    display: flex;
    align-items: center;
  }
  :deep(.v-list-item__content) > .v-list-item-title {
    font-size: 15px;
    font-weight: bold;
  }
  :deep(.v-list-item__content) > .logo {
    margin: 0 10px;
  }
  :deep(.v-list-item__content) > .title {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
  }
  :deep(.v-list-group__items) > .v-list-item {
    padding-left: 30px !important;
  }
  :deep(.v-list-item__prepend) > .v-icon {
    margin-inline-end: 15px;
  }
}
</style>
