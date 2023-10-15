<script lang="ts" setup>
import { ref } from "vue";
import logo from "~/public/logo.png";

const menus = [
  {
    title: "Đặt sân",
    url: "/football-pitches/rental",
  },
  {
    title: "Phụ kiện",
    url: "/accessories",
  },
];

const drawer = ref(false);
</script>
<template>
  <div class="toolbar-header">
    <div class="navbar">
      <div class="menu">
        <nuxt-link class="navitem -home" to="/">
          <v-icon> mdi mdi-home </v-icon>
        </nuxt-link>
        <nuxt-link
          class="navitem"
          v-for="(menu, index) in menus"
          :key="index"
          :to="menu.url"
        >
          {{ menu.title }}
        </nuxt-link>
      </div>
      <div class="title">
        <h3>Sân bóng Hoàng Quân</h3>
        <p class="en">Hoang Quan football field</p>
      </div>
      <div class="sidebaricon">
        <v-icon class="icon" @click="drawer = !drawer"> mdi mdi-menu </v-icon>
      </div>
    </div>
    <v-navigation-drawer
      class="navigationdrawer"
      color="white"
      v-model="drawer"
    >
      <div class="sidebar">
        <nuxt-link class="sideitem -home" to="/">
          <img :src="logo" alt="Logo" class="logo" />
          <div class="title">
            <h3>Sân bóng Hoàng Quân</h3>
          </div>
        </nuxt-link>
        <nuxt-link
          class="sideitem"
          v-for="(menu, index) in menus"
          :key="index"
          :href="menu.url"
        >
          {{ menu.title }}
        </nuxt-link>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-header {
  > .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  > .navbar > .menu {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  > .navbar > .menu > .navitem {
    display: block;
    transition: 0.2s linear;
    padding: 15px 25px;
    color: #000;
    text-decoration: none;
    &.-home {
      padding: 8px 15px;
      font-size: 25px;
    }
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) inset;
    }
  }
  > .navbar > .sidebaricon,
  > .navbar > .title {
    display: none;
  }
  > .navigationdrawer {
    display: none;
  }
}
</style>
