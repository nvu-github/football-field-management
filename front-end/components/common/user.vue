<script lang="ts" setup>
const menu = ref(false);
</script>
<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <div
        v-bind="props"
        active-class="false"
        :class="[
          'icon',
          {
            '-open': menu,
          },
        ]"
      >
        <v-icon>mdi mdi-account-circle</v-icon>
      </div>
    </template>

    <v-card min-width="250">
      <v-list>
        <v-list-item
          prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
          title="John Leider"
          subtitle="Founder of Vuetify"
        >
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          prepend-icon="mdi mdi-folder-account"
          title="Thông tin cá nhân"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi mdi-logout"
          title="Đăng xuất"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<style lang="scss" scoped>
.icon {
  position: relative;
  margin-top: -3px;
  margin-right: 40px;
  margin-left: 10px;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    bottom: 38%;
    left: 35px;
    margin-left: -5px;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #5c5c5c;
    border-left: 6px solid transparent;
  }
  &.-open::after {
    content: "";
    border-bottom: none;
    border-top: 6px solid #5c5c5c;
  }
}
</style>
