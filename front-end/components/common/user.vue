<script lang="ts" setup>
const menu = ref(false);
</script>
<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <div class="user" v-bind="props">
        <v-avatar size="40">
          <v-img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            aspect-ratio="1"
          ></v-img>
        </v-avatar>
        <span class="name">Admin</span>
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
          prepend-icon="mdi mdi-account-circle"
          title="Profile"
        ></v-list-item>
        <v-list-item prepend-icon="mdi mdi-logout" title="Logout"></v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
