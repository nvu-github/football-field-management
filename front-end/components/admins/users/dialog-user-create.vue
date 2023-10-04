<script lang="ts" setup>
import { useUserStore } from "~/stores/user";

const { $toast } = useNuxtApp();
const userStore = useUserStore();
const { createAccount } = userStore;
const { accountCreate } = storeToRefs(userStore);
const { dialog, closeDialog } = useDialogStore();
const { data } = dialog;

function closeDialogUserCreate() {
  closeDialog();
}
async function addAccount() {
  $toast.success("ok");
  // const user = await createAccount(accountCreate);
}
</script>
<template>
  <div class="dialog-user-create">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{
          data && data.type === "create"
            ? "Thêm tài khoản"
            : "Cập nhật tài khoản"
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.trim="accountCreate.email"
                label="Email*"
                variant="underlined"
                required
              ></v-text-field>
              <v-text-field
                v-model.trim="accountCreate.password"
                label="Mật khẩu*"
                type="password"
                variant="underlined"
                required
              ></v-text-field>
              <v-autocomplete
                v-model.trim="accountCreate.role"
                label="Quyền"
                :items="['Nhân viên', 'Khách hàng']"
                variant="underlined"
              ></v-autocomplete>
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
        <v-btn
          v-if="data && data.type === 'create'"
          color="blue-darken-1"
          variant="text"
          @click="addAccount"
        >
          Lưu
        </v-btn>
        <v-btn v-else color="blue-darken-1" variant="text"> Cập nhật </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.dialog-user-create {
  width: 500px;
}
</style>
