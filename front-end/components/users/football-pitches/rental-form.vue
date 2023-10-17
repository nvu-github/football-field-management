<script lang="ts" setup>
const date = ref(new Date());
const format = (date: any) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

</script>
<template>
  <div class="rental-form">
    <v-form>
      <v-autocomplete
        label="Chọn sân bóng*"
        item-value="id"
        item-title="name"
        variant="underlined"
      ></v-autocomplete>
      <common-date-picker v-model="date" :format="format" />
      <v-autocomplete
        label="Chọn khung giờ*"
        item-value="id"
        item-title="name"
        variant="underlined"
      ></v-autocomplete>
      <v-text-field
        label="Giá thuê (VNĐ)*"
        type="text"
        variant="underlined"
        required
      ></v-text-field>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
</style>
