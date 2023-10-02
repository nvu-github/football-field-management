<script lang="ts" setup>
const { dialog, closeDialog } = useDialogStore();

const { data } = dialog;

function closeDialogUserCreate() {
  closeDialog();
}
</script>
<template>
  <div class="dialog-confirm">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <h1>Bạn có chắc chắn muốn xóa?</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="closeDialogUserCreate"
        >
          Đóng
        </v-btn>
        <v-btn color="blue-darken-1" variant="text"> Xóa </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
