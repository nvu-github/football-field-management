<script setup lang="ts">
let toggleMenu = ref<Boolean>(true)
function toggleShowNavBar(drawer: Boolean) {
  toggleMenu.value = drawer
}
</script>
<template>
  <v-app>
    <layout-admin-navbar :toggle-menu="toggleMenu" />
    <layout-admin-header @drawer="toggleShowNavBar" />
    <v-main>
      <div class="main">
        <slot />
      </div>
      <layout-admin-footer />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.main {
  padding: 40px 35px;
  min-height: 600px;
}
</style>
