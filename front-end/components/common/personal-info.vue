<script lang="ts" setup>
import userImg from "~/public/user.jpg";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useNuxtApp, useRuntimeConfig } from "nuxt/app";
import { useUserStore, useAuthStore, useAppStore } from "~/stores";

const rules = {
  name: (value: string) => {
    if (!value) return "Vui lòng nhập họ tên!";
  },
  teamName: (value: string) => {
    if (!value) return "Vui lòng nhập tên đội bóng!";
  },
  phoneNumber: (value: string) => {
    if (!value) return "Vui lòng nhập số điện thoại!";
  },
  dateOfBirth: (value: string) => {
    if (!value) return "Vui lòng nhập ngày sinh!";
  },
  address: (value: string) => {
    if (!value) return "Vui lòng nhập địa chỉ!";
  },
};

const { $toast }: any = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();
const authStore = useAuthStore();
const appStore = useAppStore();
const { personalInfo }: any = storeToRefs(userStore);
const { user }: any = storeToRefs(authStore);
const CUSTOMER_ROLE = 4;
const fileUpload = ref<any>();
const fileUploadPreview = ref<any>();
if (user.value?.roleId === CUSTOMER_ROLE) personalInfo.value.gender = "MALE";
if (user.value) {
  fileUploadPreview.value = user.value.avatar
    ? `${runtimeConfig.public.API_URL}public/${user.value.avatar}`
    : "";
}

(await user.value?.roleId) === CUSTOMER_ROLE
  ? userStore.getCustomerInfo()
  : userStore.getStaffInfo();

const formatDatePicker = (date: any): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

async function UpdatePersonalInfo() {
  try {
    if (!validForm) {
      return $toast.error("Vui lòng nhập đầy đủ thông tin");
    }
    const urlAvatar = await uploadFile();

    const updatedInfo = {
      ...personalInfo.value,
      avatar: urlAvatar,
      teamName: "",
    };

    if (!fileUpload.value) delete updatedInfo.avatar;
    if (user.value?.roleId === CUSTOMER_ROLE) {
      userStore.updatePersonalInfoCustomer(updatedInfo);
    } else {
      userStore.updatePersonalInfoStaff(updatedInfo);
    }

    user.value.avatar = urlAvatar;
    updateLocalStorage();
    $toast.success("Cập nhật thông tin thành công");
  } catch (error) {
    console.log(error);
    $toast.error("Cập nhật thông tin thất bại");
  }
}

async function uploadFile() {
  if (fileUpload.value) {
    const formData = new FormData();
    formData.append("type", "avatar");
    formData.append("file", fileUpload.value);
    const uploaded = await appStore.uploadImage(formData);
    return uploaded.data.url;
  }
  return null;
}

function updateLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("userLogin"));
  storedData.avatar = user.value.avatar;
  localStorage.setItem("userLogin", JSON.stringify(storedData));
}

function handleUploadFile(e: any) {
  const file = e.target.files[0];
  fileUpload.value = file;
  fileUploadPreview.value = URL.createObjectURL(file);
}

function validForm() {
  const { name, teamName, phoneNumber, dateOfBirth, address, gender } =
    personalInfo.value;
  if (
    (user.value?.roleId === CUSTOMER_ROLE && !name) ||
    !teamName ||
    !phoneNumber
  ) {
    return false;
  }
  if (
    (user.value?.roleId !== CUSTOMER_ROLE && !name) ||
    !phoneNumber ||
    !dateOfBirth ||
    !address ||
    !gender
  ) {
    return false;
  }
  return true;
}
</script>
<template>
  <div class="persional-info">
    <v-form v-model="personalInfo.value" @submit.prevent="UpdatePersonalInfo">
      <v-row class="row">
        <v-col md="6">
          <v-text-field
            v-model="personalInfo.name"
            label="Họ tên*"
            variant="underlined"
            :rules="[rules.name]"
          ></v-text-field>
          <!-- <v-text-field
            v-if="user?.roleId === CUSTOMER_ROLE"
            v-model="personalInfo.teamName"
            label="Tên đội bóng*"
            variant="underlined"
            :rules="[rules.teamName]"
          ></v-text-field> -->
          <v-text-field
            v-model="personalInfo.phoneNumber"
            label="Số điện thoại*"
            variant="underlined"
            :rules="[rules.phoneNumber]"
          ></v-text-field>
          <common-date-picker
            v-if="user?.roleId !== CUSTOMER_ROLE"
            v-model="personalInfo.dateOfBirth"
            class="datepicker"
            placeholder="Ngày sinh"
            :format="formatDatePicker"
          />
          <v-radio-group
            v-if="user?.roleId !== CUSTOMER_ROLE"
            v-model="personalInfo.gender"
            inline
          >
            <template #prepend> Giới tính: </template>
            <v-radio label="Nam" value="MALE"></v-radio>
            <v-radio label="Nữ" value="FEMALE"></v-radio>
            <v-radio label="Khác" value="OTHER"></v-radio>
          </v-radio-group>
          <v-file-input
            v-model="personalInfo.avatar"
            accept="image/*"
            type="file"
            prepend-icon="mdi-camera"
            variant="underlined"
            label="Ảnh đại diện"
            @change="handleUploadFile"
          ></v-file-input>
          <div class="action mt-5">
            <v-btn class="button -success" type="submit">
              Cập nhật thông tin
            </v-btn>
          </div>
        </v-col>
        <v-col v-if="fileUploadPreview" class="avatar" md="2">
          <div class="content">
            <p class="title">Ảnh đại diện</p>
            <v-avatar color="grey" size="120" rounded="0">
              <v-img cover :src="fileUploadPreview"></v-img>
            </v-avatar>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.persional-info {
  :deep(.row) {
    justify-content: center;
  }
  :deep(.action) {
    display: flex;
    justify-content: center;
  }
}
.avatar {
  > .content {
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid #a9ca31;
    border-radius: 5px;
    padding: 10px;
  }
  > .content > .title {
    border-bottom: 2px solid #a9ca31;
    text-align: center;
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
