<script setup lang="ts">
import { ref } from "vue";

const headerMenu = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About Me",
    href: "/about-me",
  },
  {
    title: "Work",
    href: "/work",
  },
  {
    title: "Contact",
    href: "/contact",
  },
  {
    title: "Freebies",
    href: "/freebies",
  },
];

const drawer = ref(false);
const isActive = ref(true);
</script>
<template>
  <div class="toolbar-header">
    <v-app-bar app flat class="app-header">
      <v-toolbar>
        <div
          class="navigation"
          :class="[isActive ? 'd-block' : '']"
          @click="isActive = !isActive"
        >
          <ul class="navbar-nav d-flex" min-height="auto">
            <li
              class="nav-item"
              v-for="nav in headerMenu"
              :key="nav.title"
              text
            >
              <nuxt-link :to="nav.href" class="nav-link">{{
                nav.title
              }}</nuxt-link>
            </li>
          </ul>
        </div>
        <v-app-bar-nav-icon
          width="35"
          height="35"
          class="d-md-none d-sm-flex drawer-icon ml-auto mr-0"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-toolbar>
    </v-app-bar>
    <div class="nav-sidebar">
      <v-navigation-drawer color="white" v-model="drawer">
        <div
          class="navigation"
          :class="[isActive ? 'd-block' : '']"
          @click="isActive = !isActive"
        >
          <ul class="navbar-nav py-4" min-height="auto">
            <li
              class="nav-item mb-3"
              v-for="nav in headerMenu"
              :key="nav.title"
              text
            >
              <nuxt-link :to="nav.href" class="nav-link text-dark">{{
                nav.title
              }}</nuxt-link>
            </li>
            <!-- <li class="nav-item mx-3 mt-4">
              <v-btn
                class="btn bg-primary-light"
                flat
                block
                variant="outlined"
                color="primary"
              >
                Hire Me
              </v-btn>
            </li> -->
          </ul>
        </div>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  position: relative !important;
  background-color: transparent !important;
  > .v-toolbar {
    background-color: transparent;
  }
  .v-btn__overlay,
  .v-btn--variant-text .v-btn__overlay {
    background-color: transparent !important;
  }
}

.nav-sidebar {
  :deep(.v-navigation-drawer) {
    transform: translateX(-110%) !important;
    margin-top: -64px !important;
    height: 100vh !important;
    z-index: 2000 !important;
  }
}

.navbar-nav {
  align-items: center;
  flex-direction: row;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
  > .nav-item {
    transition: 0.2s ease-in;
    position: relative;
    &:hover,
    &.active > .nav-link {
      opacity: 1;
    }
  }
  > .nav-item > .nav-link {
    text-decoration: none;
    padding: 15px;
    font-size: 17px;
    color: rgb(var(--v-theme-white));
    opacity: 0.5;
    font-size: 16px;
  }
  > .nav-item > .router-link-exact-active {
    opacity: 1;
  }
}

@media (max-width: 767px) {
  .app-header {
    &:deep(.navigation) {
      display: none !important;
    }
  }
  .app-header > :deep(.navbar-nav) {
    position: absolute;
    left: 0;
    top: 80px;
    width: 100%;
    background-color: #607df9;
    flex-direction: column !important;
    box-shadow: 0px 15px 30px rgb(0 0 0 / 12%);
  }

  .app-header > :deep(.navbar-nav) > .nav-item {
    text-align: center;
  }
  .app-header > :deep(.navbar-nav) > .nav-item > .nav-link {
    line-height: 55px !important;
  }

  .nav-sidebar {
    :deep(.v-navigation-drawer--active) {
      transform: translateX(0%) !important;
    }
  }

  .px-sm-0 {
    padding-left: 0;
    padding-right: 0;
  }
  .mob-imagesetter {
    background-size: unset;
    background-position: unset !important;
    margin-top: 29px;
  }
  .banner-title {
    margin-top: -30px;
  }
}

@media (max-width: 991px) {
  .mob-header-fixed {
    position: fixed;
  }
}
</style>
