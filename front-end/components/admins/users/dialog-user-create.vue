<script lang="ts" setup>
import { useUserStore } from "~/stores";

const rules = {
  email: (value: string) => {
    if (!value) return "Vui lòng nhập email!";
    if (!/.+@.+\..+/.test(value)) return "Email không đúng định dạng!";
    return true;
  },
  password: (value: string) => {
    if (!value) "Vui lòng nhập mật khẩu!";
    return true;
  },
  role: (value: number) => {
    if (!value) "Vui lòng chọn quyền cho tài khoản!";
    return true;
  },
};
const { $toast } = useNuxtApp();
const userStore = useUserStore();
const { createAccount } = userStore;
const { account } = storeToRefs(userStore);
const { dialog, closeDialog } = useDialogStore();
const { data } = dialog;
const accountCreate = ref<AccountCreate>({
  email: "",
  password: "",
  roleId: "",
});

function closeDialogUserCreate() {
  closeDialog();
}
async function addAccount() {
  try {
    await createAccount(accountCreate.value);
    await userStore.getAccounts();
    $toast.success("Thêm tài khoản thành công");
  } catch (error) {
    $toast.error("Thêm tài khoản thất bại");
  }
  closeDialog();
}
function setAccountToForm() {
  // accountCreate.email.value = account.value.email;
  // accountCreate.roleId.value = account.value.role;
  console.log(account.value);
}
if (data.type === "update") {
  userStore.getAccount(data.id);
  setAccountToForm();
}
</script>
<template>
  <div class="dialog-user-create">
    <v-form v-model="accountCreate.value" @submit.prevent="addAccount">
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
                  :rules="[rules.email]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="accountCreate.password"
                  label="Mật khẩu*"
                  type="password"
                  variant="underlined"
                  :rules="[rules.password]"
                  required
                ></v-text-field>
                <v-autocomplete
                  v-model="accountCreate.roleId"
                  label="Quyền*"
                  item-value="id"
                  item-title="name"
                  :rules="[rules.role]"
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
            :disabled="!accountCreate.value"
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
