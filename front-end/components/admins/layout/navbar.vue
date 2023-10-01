<script lang="ts" setup>
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
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
      title="John Leider"
      nav
      class="info"
    >
      <template #append>
        <v-icon class="icon" @click="closeNavbar"> mdi mdi-close-thick </v-icon>
      </template>
    </v-list-item>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        value="home"
      ></v-list-item>
      <v-list-group value="Users">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="Users"
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
      <v-list-item
        prepend-icon="mdi-account"
        title="My Account"
        value="account"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.navigationadmin {
  :deep(.v-list-item__append) > .icon {
    display: none;
  }
  :deep(.v-navigation-drawer__content) > .info {
    padding: 20px;
  }
}
</style>
