<script lang="ts" setup>
import { resolveComponent } from "vue";
import { useDialogStore } from "~/stores";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  typeId: {
    type: Number,
    required: true,
  },
  typeName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const dialogStore = useDialogStore();

async function openDialogAccessoryDetail(id: number) {
  await dialogStore.showDialog(
    resolveComponent("user-accessory-dialog-detail"),
    {
      id,
    }
  );
}
const accessoryId = props.id;
</script>

<template>
  <v-card class="card-info mx-auto" max-width="344">
    <v-img :src="props.avatar" height="200px" cover />
    <v-card-title class="name"> {{ props.name }} </v-card-title>
    <v-card-text class="content">
      <div class="status">
        <b class="label">Loại: </b>
        <v-chip :color="props.typeId === 1 ? 'primary' : 'orange'">{{
          props.typeName
        }}</v-chip>
      </div>
      <div class="price mt-2">
        <b class="label">Giá thuê:</b> {{ props.price }}
      </div>
    </v-card-text>
    <v-card-action class="action">
      <v-tooltip location="right" text="Chi tiết">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="button -warning -rental"
            @click="openDialogAccessoryDetail(accessoryId)"
          >
            <v-icon>mdi mdi-alpha-d-circle-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-action>
  </v-card>
</template>
<style lang="scss" scoped>
.card-info {
  > .content {
    padding-bottom: 0;
  }
  > .content > .status > .v-chip {
    border-radius: 6px;
  }
  > .content > .price {
    color: #e60000;
  }
  > .content > .price > .label {
    color: #000;
  }
  > .action {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
  > .action > .button {
    padding: 0;
    min-width: 45px;
  }
}
</style>
