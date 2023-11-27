<script lang="ts" setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "nuxt/app";
import { useAppStore, useAuthStore } from "~/stores";
import logo from "~/public/logo.png";

const appStore = useAppStore();
const authStore = useAuthStore();
const route = useRoute();
const { user }: any = storeToRefs(authStore);
const { isShowSidebar } = storeToRefs(appStore);

// admin: 1
// ke toan: 2
// quan ly phu kien: 3

const menus = ref<Menu>([
  {
    icon: "mdi-home",
    title: "Trang chủ",
    url: "/admin/",
    roleId: [1, 2, 3],
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
        roleId: [1],
      },
    ],
    roleId: [1],
  },
  {
    icon: "mdi mdi-soccer-field",
    title: "Quản lý sân bóng",
    url: "/admin/football-pitches",
    subMenus: [
      {
        icon: "mdi mdi-format-list-bulleted-type",
        title: "Loại sân bóng",
        url: "/admin/football-pitches/types",
        roleId: [1],
      },
      {
        icon: "mdi mdi-soccer",
        title: "Sân bóng",
        url: "/admin/football-pitches",
        roleId: [1],
      },
      {
        icon: "mdi mdi-clock-time-three-outline",
        title: "Thời gian thuê",
        url: "/admin/football-pitches/leasing-durations",
        roleId: [1],
      },
      {
        icon: "mdi mdi-cog",
        title: "Giá thuê sân",
        url: "/admin/football-pitches/prices",
        roleId: [1],
      },
      {
        icon: "mdi mdi-check-all",
        title: "Xác nhận đặt sân",
        url: "/admin/football-pitches/rental/confirm",
        roleId: [1],
      },
    ],
    roleId: [1],
  },
  {
    icon: "mdi mdi-cog",
    title: "Quản lý phụ kiện",
    url: "/admin/accessories",
    subMenus: [
      {
        icon: "mdi mdi-receipt-text-edit-outline",
        title: "Loại phụ kiện",
        url: "/admin/accessories/types",
        roleId: [3],
      },
      {
        icon: "mdi mdi-briefcase-edit-outline",
        title: "Phụ kiện",
        url: "/admin/accessories",
        roleId: [3],
      },
    ],
    roleId: [3],
  },
  {
    icon: "mdi mdi-receipt-text-outline",
    title: "Hóa đơn",
    url: "/admin/invoices",
    roleId: [2],
  },
  {
    icon: "mdi mdi-chart-bar",
    title: "Thống kê",
    url: "/admin/report",
    subMenus: [
      {
        icon: "mdi mdi-finance",
        title: "Doanh thu",
        url: "/admin/report/revenue",
        roleId: [1, 2],
      },
      {
        icon: "mdi mdi-account-cash-outline",
        title: "Lượt thuê",
        url: "/admin/report/rental-field",
        roleId: [1],
      },
      {
        icon: "mdi mdi-chart-pie",
        title: "Phụ kiện",
        url: "/admin/report/accessory",
        roleId: [1, 3],
      },
      {
        icon: "mdi mdi-vote-outline",
        title: "Đánh giá",
        url: "/admin/report/evaluation",
        roleId: [1],
      },
    ],
    roleId: [1, 2, 3],
  },
]);

const filteredMenus = computed(() =>
  menus.value.filter((menu: any) => {
    if (!menu.subMenus) {
      return menu.roleId.includes(user.value.roleId);
    }

    menu.subMenus = menu.subMenus.filter((subMenu: any) =>
      subMenu.roleId.includes(user.value.roleId)
    );

    return menu.roleId.includes(user.value.roleId) && menu.subMenus.length > 0;
  })
);

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
      <div v-for="(menu, index) in filteredMenus" :key="index" class="menu">
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
