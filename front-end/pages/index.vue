<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "~/stores";
const appStore = useAppStore();
const { breadCrumbs } = storeToRefs(appStore);
breadCrumbs.value = [];
</script>
<template>
  <div class="home-page">
    <h1 class="h1 mb-3">Lịch đặt sân hôm nay</h1>
    <v-row>
      <v-col md="12">
        <v-sheet class="mx-auto">
          <v-slide-group v-model="model" class="pa-4" center-active show-arrows>
            <v-slide-group-item
              v-for="n in 15"
              :key="n"
              v-slot="{ isSelected, toggle }"
            >
              <v-card
                :color="isSelected ? 'primary' : 'grey-lighten-1'"
                class="ma-4"
                height="200"
                width="970"
                @click="toggle"
              >
                <div class="d-flex fill-height align-center justify-center">
                  <v-scale-transition>
                    <v-icon
                      v-if="isSelected"
                      color="white"
                      size="48"
                      icon="mdi-close-circle-outline"
                    ></v-icon>
                  </v-scale-transition>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </v-col>
      <!-- <v-col md="6">
        <user-football-pitch-card-info />
      </v-col>
      <v-col md="6">
        <user-football-pitch-card-info />
      </v-col>
      <v-col md="6">
        <user-football-pitch-card-info />
      </v-col>
      <v-col md="6">
        <user-football-pitch-card-info />
      </v-col>
      <v-col md="6">
        <user-football-pitch-card-info />
      </v-col>
      <v-col md="6">
        <user-football-pitch-card-info />
      </v-col> -->
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.home-page {
  > .h1 {
    font-size: 20px;
  }
}
</style>
