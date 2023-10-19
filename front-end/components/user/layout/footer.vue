<script lang="ts" setup>
import logo from "~/public/logo.png";
</script>
<template>
  <div class="footer">
    <div class="content">
      <div class="logo">
        <img :src="logo" alt="logo" class="img" width="100" />
      </div>
      <div class="title">
        <p class="name">Sân bóng Hoàng Quân</p>
        <p class="phone">SĐT: 0987 833 933 - 0964 573 999</p>
        <p class="address">Địa chỉ: Thị Trấn Sông Thao, Cẩm Khê, Phú Thọ</p>
      </div>
      <div class="location">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.088021208504!2d105.1270400748594!3d21.425784974024698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31349b36d4f89b91%3A0xb1d728b96a5ebc3f!2zU8OibiBCw7NuZyBOaMOibiBU4bqhbyBIb8OgbmcgUXXDom4!5e0!3m2!1svi!2s!4v1697359568291!5m2!1svi!2s"
          width="300"
          height="120"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="map"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer {
  > .content {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  > .content > .logo {
    display: flex;
    align-items: center;
    width: 100px;
    height: 100px;
    background: #fff;
  }
  > .content > .title {
    width: 50%;
    margin-left: 30px;
  }
  > .content > .title > .name {
    font-size: 20px;
    font-weight: bold;
  }
  > .content > .location > .map {
    border: none;
  }
}
</style>
