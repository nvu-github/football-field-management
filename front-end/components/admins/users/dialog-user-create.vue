<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores";

const rules = {
  email: (value: string) => !!value || "Vui lòng nhập email!",
  password: (value: string) => !!value || "Vui lòng nhập mật khẩu!",
};
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
  console.log(rules);
  console.log(accountCreate.value);
  $toast.success("Thêm tài khoản thành công");
  // const user = await createAccount(accountCreate);
}
</script>
<template>
  <div class="dialog-user-create">
    <v-form v-model="accountCreate" @submit.prevent="addAccount">
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
                  v-model.trim="email"
                  label="Email*"
                  variant="underlined"
                  :rules="[rules.email]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="password"
                  label="Mật khẩu*"
                  type="password"
                  variant="underlined"
                  :rules="[rules.password]"
                  required
                ></v-text-field>
                <v-autocomplete
                  v-model.trim="roleId"
                  label="Quyền"
                  item-value="id"
                  item-title="name"
                  :items="[
                    {
                      id: 2,
                      name: 'Nhân viên kế toán',
                    },
                    {
                      id: 3,
                      name: 'Nhân viên cho thuê và bán phụ kiện',
                    },
                    {
                      id: 4,
                      name: 'Khách hàng',
                    },
                  ]"
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
            type="submit"
            :disabled="!accountCreate"
            @click="addAccount"
          >
            Lưu
          </v-btn>
          <v-btn v-else color="blue-darken-1" variant="text"> Cập nhật </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-user-create {
  width: 500px;
}
</style>
