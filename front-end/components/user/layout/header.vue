<script lang="ts" setup>
import logo from "~/public/logo.png";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const searchText = ref<string>("");
const isLoading = ref<boolean>(false);

async function handleSearchAccessories() {
  isLoading.value = true;
  if (!searchText.value) return (isLoading.value = false);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  isLoading.value = false;
  navigateTo(`/accessories/search?name=${searchText.value}`);
}
</script>
<template>
  <div class="header">
    <img :src="logo" alt="logo" class="logo" />
    <div class="title">
      <h2 class="vi">Sân bóng Hoàng Quân</h2>
      <p class="en">Hoang Quan football field</p>
    </div>
    <div class="searchform">
      <common-input
        v-model="searchText"
        placeholder="Tìm kiếm thông tin phụ kiện"
        hide-details="auto"
        slot="append"
        required
      >
        <v-btn
          class="button"
          :loading="isLoading"
          @click="handleSearchAccessories"
        >
          <v-icon> mdi mdi-magnify </v-icon>
        </v-btn>
      </common-input>
      <nuxt-link v-if="!user" class="user" to="/auth/login">
        <v-icon class="icon">mdi mdi-account-circle</v-icon>
      </nuxt-link>
      <common-user-info v-else class="userinfo" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;

  > .logo {
    width: 120px;
    margin-right: 20px;
  }

  > .title {
    flex: 1;
  }

  > .searchform {
    display: flex;
    align-items: center;
    width: 380px;
  }

  > .searchform > .user {
    display: block;
    margin-left: 5px;
    padding: 10px;
    color: #000;
  }

  > .searchform > :deep(.icon) {
    margin-top: 0;
    color: #000;
  }

  > .searchform > :deep(.icon) > .v-icon {
    font-size: 35px;
  }

  > .searchform > :deep(.icon)::after {
    content: none;
  }

  > .searchform > .user > .icon {
    font-size: 35px;
  }

  :deep(.v-field__field) > .v-field__input {
    border-radius: 5px 0 0 5px;
  }

  :deep(.input) > .v-input__append {
    margin: 0;
  }

  :deep(.input) > .v-input__append > .button {
    border-radius: 0 5px 5px 0;
    box-shadow: none;
    background-color: #a9ca31;
  }
}
</style>
