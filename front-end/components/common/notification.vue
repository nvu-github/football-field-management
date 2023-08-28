<script lang="ts" setup>
const menu = ref(false);
const items = ref([
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    title: "Brunch this weekend?",
    subtitle: `2 days ago`,
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
    title: "Summer BBQ",
    subtitle: `4 days ago`,
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
    title: "Oui oui",
    subtitle: `5 days ago`,
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
    title: "Birthday gift",
    subtitle: `1 days ago`,
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
    title: "Recipe to try",
    subtitle: `3 days ago`,
  },
]);
</script>
<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn v-bind="props" active-class="false">
        <v-badge color="error" :content="0" overlap>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card min-width="300">
      <div class="header">
        <div class="title">Notification</div>
        <div class="skip">Mark as seen</div>
      </div>
      <v-divider></v-divider>

      <v-list :items="items" item-props lines="three">
        <template v-slot:subtitle="{ subtitle }">
          <div v-html="subtitle"></div>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  > .title {
    font-size: 20px;
    font-weight: bold;
  }

  .skip {
    right: 0;
  }
}
</style>
