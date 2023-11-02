<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
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
const customerRole = "4";
const { $toast }: any = useNuxtApp();
const userStore: any = useUserStore();
const appStore = useAppStore();
const { isLoading } = storeToRefs(appStore);
const { roles, account } = storeToRefs(userStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const accountCreate = ref<ParamAccount>({
  email: "",
  password: "",
  roleId: "",
});

onBeforeMount(async () => {
  if (id) {
    await userStore.getAccount(id);
    setAccountToForm();
  }
});

function closeDialogUserCreate() {
  closeDialog();
}
async function actionAccount() {
  try {
    const { roleId } = accountCreate.value;

    if (id && typeof roleId === "string") {
      const foundRole = roles.value.find(
        (role: any) => role.name.toLowerCase() === roleId.toLowerCase()
      );

      if (foundRole) {
        accountCreate.value = { ...accountCreate.value, roleId: foundRole.id };
      }
    }

    accountCreate.value = id
      ? { ...accountCreate.value, id }
      : accountCreate.value;
    await userStore[action](accountCreate.value);

    $toast.success(`${title} tài khoản thành công`);
    await userStore.getAccounts();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} tài khoản thất bại`);
  } finally {
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
    <v-form v-model="accountCreate.value" @submit.prevent="actionAccount">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} tài khoản</span>
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
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!accountCreate.value"
          >
            {{ title }}
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
