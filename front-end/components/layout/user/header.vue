<script lang="ts" setup>
import logo from "../../../public/logo.png";

const rules = [(value) => !!value || "Vui lòng nhập thông tin tìm kiếm!"];
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
        :rules="rules"
        placeholder="Tìm kiếm..."
        hide-details="auto"
        slot="append"
        required
      >
        <v-btn class="button">
          <v-icon> mdi mdi-magnify </v-icon>
        </v-btn>
      </common-input>
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
    width: 350px;
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
