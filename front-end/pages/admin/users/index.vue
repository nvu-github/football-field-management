<script lang="ts" setup>
const headers = [
  {
    title: "Dessert (100g serving)",
    align: "start",
    sortable: false,
    key: "name",
  },
  { title: "Calories", key: "calories" },
  { title: "Fat (g)", key: "fat" },
  { title: "Carbs (g)", key: "carbs" },
  { title: "Protein (g)", key: "protein" },
  { title: "Actions", key: "actions", sortable: false },
];
const desserts = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
  },
];
</script>
<template>
  <div class="user-page">
    <v-row class="row">
      <v-col md="12" class="column">
        <button class="button">Thêm tài khoản</button>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table :headers="headers" :items="desserts" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2"> mdi-pencil </v-icon>
            <v-icon size="small"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.user-page {
  .row > .column {
    display: flex;
    justify-content: right;
  }
}
</style>
