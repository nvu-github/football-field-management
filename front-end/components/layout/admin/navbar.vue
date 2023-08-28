<script lang="ts" setup>
const drawer = ref<boolean>(true);
const rail = ref<boolean>(false);

const admins = ref([
  ["Management", "mdi-account-multiple-outline"],
  ["Settings", "mdi-cog-outline"],
]);
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    class="navigation"
  >
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
      title="John Leider"
      nav
      class="info"
    >
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-menu"
          @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>

    <!-- <v-divider></v-divider> -->

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

<style lang="scss" scoped></style>
