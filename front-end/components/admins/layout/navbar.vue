<script lang="ts" setup>
import logo from "~/public/logo.png";
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores";

const appStore = useAppStore();
const { isShowSidebar } = storeToRefs(appStore);

const admins = ref([
  ["Management", "mdi-account-multiple-outline"],
  ["Settings", "mdi-cog-outline"],
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
      <v-list-item
        prepend-icon="mdi-home"
        title="Trang chủ"
        value="home"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account"
        title="Quản lý tài khoản"
        value="account"
      ></v-list-item>
      <v-list-group value="Users">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi mdi-soccer-field"
            title="Quản lý sân bóng"
          ></v-list-item>
        </template>
        <v-list-item
          v-for="([title, icon], i) in admins"
          :key="i"
          :title="title"
          :prepend-icon="icon"
          :value="title"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.navigationadmin {
  :deep(.v-list-item__append) > .icon {
    display: none;
  }
  :deep(.v-navigation-drawer__content) > .info {
    padding: 10px;
  }
  :deep(.v-list-item__content) {
    display: flex;
    align-items: center;
  }
  :deep(.v-list-item__content) > .logo {
    margin: 0 10px;
  }
  :deep(.v-list-item__content) > .title {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
