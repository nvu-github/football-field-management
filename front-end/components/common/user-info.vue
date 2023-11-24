<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useNuxtApp, useRuntimeConfig } from "nuxt/app";
import { useAuthStore } from "~/stores";
import userImg from "~/public/user.jpg";

const router = useRouter();
const { $toast }: any = useNuxtApp();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const runtimeConfig = useRuntimeConfig();
const menu = ref(false);
const CUSTOMER_ROLE = 4;

async function logout() {
  try {
    $toast.success("Đăng xuất tài khoản thành công");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    user.value = {
      name: "",
      email: "",
      avatar: "",
      roleId: null,
      loggedIn: false,
    };
    authStore.signOut();
    return router.push("/auth/login");
  } catch (error) {
    console.log(error);
    $toast.error("Đăng xuất tài khoản thất bại");
  }
}
</script>
<template>
  <v-menu v-model="menu">
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
          :prepend-avatar="
            user?.avatar
              ? `${runtimeConfig.public.API_URL}public/${user.avatar}`
              : userImg
          "
          :title="user?.name"
          :subtitle="user?.email"
        >
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          :to="
            user?.roleId === CUSTOMER_ROLE
              ? '/personal-info'
              : '/admin/personal-info'
          "
          prepend-icon="mdi mdi-folder-account"
          title="Thông tin cá nhân"
          link
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi mdi-logout"
          title="Đăng xuất"
          @click="logout"
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
