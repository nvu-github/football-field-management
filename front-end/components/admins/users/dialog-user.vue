<script lang="ts" setup>
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import { useUserStore, useAppStore, useDialogStore } from "~/stores";

const rules = {
  email: (value: string) => {
    if (!value) return "Vui lòng nhập email!";
    if (!/.+@.+\..+/.test(value)) return "Email không đúng định dạng!";
    return true;
  },
  password: (value: string) => {
    if (!value) return "Vui lòng nhập mật khẩu!";
    return true;
  },
  role: (value: number) => {
    if (!value) return "Vui lòng chọn quyền cho tài khoản!";
    return true;
  },
};
const defaultTypeBtn = "update";
const customerRole = "4";
const { $toast }: any = useNuxtApp();
const userStore = useUserStore();
const appStore = useAppStore();
const { isLoading } = storeToRefs(appStore);
const { roles, account } = storeToRefs(userStore);
const { dialog, closeDialog } = useDialogStore();
const { data }: any = dialog;
const accountCreate = ref<AccountCreate>({
  email: "",
  password: "",
  roleId: "",
});

onBeforeMount(async () => {
  if (data.type === defaultTypeBtn) {
    await userStore.getAccount(data.id);
    setAccountToForm();
  }
});

function closeDialogUserCreate() {
  closeDialog();
}
async function addAccount() {
  const message = data.type === defaultTypeBtn ? "Cập nhật" : "Thêm";
  try {
    isLoading.value = true;
    const { type, id } = data;
    const { roleId } = accountCreate.value;

    if (type === defaultTypeBtn && typeof roleId === "string") {
      const foundRole = roles.value.find(
        (role) => role.name.toLowerCase() === roleId.toLowerCase()
      );

      if (foundRole) {
        accountCreate.value = { ...accountCreate.value, roleId: foundRole.id };
      }
    }

    const action =
      type === defaultTypeBtn
        ? userStore.updateAccount(id, accountCreate.value)
        : userStore.createAccount(accountCreate.value);

    await action;

    $toast.success(`${message} tài khoản thành công`);
    await userStore.getAccounts();
  } catch (error) {
    $toast.error(`${message} tài khoản thất bại`);
  } finally {
    isLoading.value = false;
    closeDialog();
  }
}

function setAccountToForm() {
  const { email, roleName }: any = account.value;
  accountCreate.value.email = email;
  accountCreate.value.roleId = roleName;
}

userStore.getRoles();
</script>
<template>
  <div class="dialog-user-create">
    <v-form v-model="accountCreate.value" @submit.prevent="addAccount">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            data && data.type === defaultTypeBtn
              ? "Cập nhật tài khoản"
              : "Thêm tài khoản"
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
                  :disabled="account?.role === customerRole"
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
                  :items="roles"
                  variant="underlined"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogUserCreate">
            Đóng
          </v-btn>
          <v-btn
            v-if="data && data.type !== 'update'"
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!accountCreate.value"
          >
            Lưu
          </v-btn>
          <v-btn
            v-else
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!accountCreate.value"
          >
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-user-create {
  width: 500px;
  :deep(.v-card) {
    padding: 5px;
  }
}
</style>
