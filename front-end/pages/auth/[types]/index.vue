<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useNuxtApp, useRoute, useRouter } from "nuxt/app";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthStore, useAppStore } from "~/stores";

definePageMeta({
  layout: "blank",
  middleware: ["auth"],
});

const CUSTOMER_ROLE = 4;

const rules = {
  email: (value: string) => {
    if (!value) return "Vui lòng nhập email!";
    if (!/.+@.+\..+/.test(value)) return "Email không đúng định dạng!";
    return true;
  },
  password: (value: string) => {
    if (!value) return "Vui lòng nhập mật khẩu!";
    if (value.length <= 5) return "Mật khẩu phải từ 6 ký tự trở lên";
    return true;
  },
  name: (value: string) => {
    if (!value) return "Vui lòng nhập tên khách hàng";
    return true;
  },
  phoneNumber: (value: string) => {
    if (!value) return "Vui lòng nhập số điện thoại";
    if (value.length < 10 || value.length > 11 || value[0] !== "0")
      return "Số điện thoại không đúng định dạng";
    return true;
  },
  rePassword: (value: string) => {
    const { password } = registerPayloads.value;
    if (!value) return "Vui lòng nhập xác nhận mật khẩu!";
    if (value !== password) return "Mật khẩu và xác nhận mật khẩu không khớp";
    return true;
  },
};

const router = useRouter();
const route = useRoute();
const { $toast }: any = useNuxtApp();
const authStore = useAuthStore();
const appStore = useAppStore();
const { isLoading } = storeToRefs(appStore);
const { user } = storeToRefs(authStore);
const step = ref(route.params.types);
const loginPayloads = ref<Login>({
  email: "",
  password: "",
});

const registerPayloads = ref<Register>({
  email: "",
  name: "",
  phoneNumber: "",
  password: "",
});

function changeRouter() {
  if (route.params.types === "login") {
    router.push({ path: "/auth/signup" });
    return;
  }
  router.push({ path: "/auth/login" });
}

async function loginUser() {
  isLoading.value = true;
  try {
    const { email, password } = loginPayloads.value;
    const userLogin = await authStore.signIn({ email, password });
    const { name, roleId, accessToken, avatar } = userLogin.data;
    user.value = {
      name: name || email,
      email,
      roleId,
      avatar,
      loggedIn: true,
    };
    localStorage.setItem(
      "userLogin",
      JSON.stringify({
        name,
        email,
        roleId,
        avatar,
        loggedIn: true,
        accessToken,
      })
    );

    $toast.success("Đăng nhập thành công");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const destination = roleId === CUSTOMER_ROLE ? "/" : "/admin";
    router.push(destination);
  } catch (error) {
    console.log(error);
    $toast.error("Thông tin email hoặc mật khẩu không chính xác");
  }
  isLoading.value = false;
}

async function Register() {
  try {
    await authStore.signUp(registerPayloads.value);
    $toast.success("Đăng ký tài khoản thành công");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/auth/login");
  } catch (error) {
    console.log(error);
    $toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
  }
}

async function loginGoogle() {
  try {
    const { $firebaseAuth }: any = useNuxtApp();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup($firebaseAuth, provider);

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const idToken = credential?.idToken || "";
    const userLoginGoogle = await authStore.signInGoogle(idToken);
    const { email, roleId, accessToken } = userLoginGoogle.data;
    const name = result.user.displayName || email;
    user.value = { name, email, roleId, avatar: "", loggedIn: true };

    localStorage.setItem(
      "userLogin",
      JSON.stringify({
        name,
        email,
        roleId,
        avatar: "",
        loggedIn: true,
        accessToken,
      })
    );
    $toast.success("Đăng nhập thành công");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/");
  } catch (error) {
    console.log(error);
    $toast.error("Thông tin email hoặc mật khẩu không chính xác");
  }
}
</script>
<template>
  <v-container class="login-pages">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10">
        <v-card class="elevation-6 mt-10">
          <v-window v-model="step">
            <v-window-item value="login">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card-text class="mt-12">
                    <v-form
                      v-model="loginPayloads.value"
                      @submit.prevent="loginUser"
                    >
                      <h1 class="text-center">ĐĂNG NHẬP</h1>
                      <v-row align="center" justify="center">
                        <v-col cols="12" sm="8">
                          <v-text-field
                            v-model="loginPayloads.email"
                            label="Email*"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            class="mt-16"
                            :rules="[rules.email]"
                          />
                          <v-text-field
                            v-model="loginPayloads.password"
                            label="Mật khẩu*"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            type="password"
                            class="mt-2 mb-1"
                            :rules="[rules.password]"
                          />
                          <!-- <v-row>
                            <v-col cols="12" class="mb-5">
                              <NuxtLink to="/auth/login"
                                ><span class="caption blue--text"
                                  >Quên mật khẩu</span
                                ></NuxtLink
                              >
                            </v-col>
                          </v-row> -->
                          <v-btn
                            color="blue"
                            class="btn"
                            block
                            type="submit"
                            :loading="isLoading"
                            :disabled="!loginPayloads.value"
                            >Đăng nhập</v-btn
                          >
                          <p class="link-auth mt-3">
                            Bạn chưa có tài khoản?
                            <nuxt-link to="/auth/signup"
                              >đăng ký ngay.</nuxt-link
                            >
                          </p>
                          <!-- <h5 class="text-center grey--text mt-4 mb-3">Hoặc</h5> -->
                          <!-- <div
                            class="d-flex justify-center align-center mx-20 mb-16"
                          >
                            <v-btn
                              class="mr-3"
                              depressed
                              outlined
                              @click="loginGoogle"
                            >
                              <img
                                src="../../../public/google-logo.svg"
                                width="20"
                                height="20"
                                alt="logo google"
                                class="mr-2"
                              />
                              Đăng nhập với Google
                            </v-btn>
                          </div> -->
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="6" class="blue rounded-bl-xl detail-auth">
                  <div style="text-align: center; padding: 180px 0">
                    <v-card-text class="white--text">
                      <h3 class="text-center">Bạn chưa có tài khoản?</h3>
                      <h5 class="text-center">
                        Vui lòng đăng ký tài khoản để có thể tiếp tục sử dụng hệ
                        thống
                      </h5>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="changeRouter"
                        >ĐĂNG KÝ</v-btn
                      >
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item value="signup">
              <v-row>
                <v-col cols="12" md="6" class="blue rounded-br-xl detail-auth">
                  <div style="text-align: center; padding: 180px 0">
                    <v-card-text class="white--text">
                      <h3 class="text-center">Bạn đã có tài khoản?</h3>
                      <h5 class="text-center">
                        Vui lòng đăng nhập để tiếp tục sử dụng hệ thống
                      </h5>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="changeRouter"
                        >ĐĂNG NHẬP</v-btn
                      >
                    </div>
                  </div>
                </v-col>

                <v-col class="form-signup" cols="12" md="6">
                  <v-card-text class="mt-5">
                    <h1 class="text-center mb-10">ĐĂNG KÝ</h1>
                    <v-form
                      v-model="registerPayloads.value"
                      @submit.prevent="Register"
                    >
                      <v-row align="center" justify="center">
                        <v-col cols="12" sm="10">
                          <v-text-field
                            v-model.trim="registerPayloads.email"
                            label="Email*"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            :rules="[rules.email]"
                          />
                          <v-text-field
                            v-model.trim="registerPayloads.name"
                            label="Tên khách hàng*"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            :rules="[rules.name]"
                          />
                          <v-text-field
                            v-model.trim="registerPayloads.phoneNumber"
                            label="Số điện thoại*"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            :rules="[rules.phoneNumber]"
                          />
                          <v-text-field
                            v-model.trim="registerPayloads.password"
                            label="Mật khẩu*"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            type="password"
                            :rules="[rules.password]"
                          />
                          <v-text-field
                            label="Xác nhận mật khẩu*"
                            outlined
                            dense
                            color="blue"
                            autocomplete="false"
                            type="password"
                            :rules="[rules.rePassword]"
                          />
                          <v-btn
                            color="blue"
                            class="btn mt-2"
                            dark
                            block
                            type="submit"
                            :loading="isLoading"
                            :disabled="!registerPayloads.value"
                            >Đăng ký</v-btn
                          >
                          <p class="link-auth mt-3">
                            Bạn đã có tài khoản?
                            <nuxt-link to="/auth/login">đăng nhập.</nuxt-link>
                          </p>
                          <!-- <h5 class="text-center grey--text mt-4 mb-3">Hoặc</h5> -->
                          <!-- <div
                            class="d-flex justify-center align-center mx-20 mb-6"
                          >
                            <v-btn
                              class="mr-3"
                              depressed
                              outlined
                              @click="loginGoogle"
                            >
                              <img
                                src="../../../public/google-logo.svg"
                                width="20"
                                height="20"
                                alt="logo google"
                                class="mr-2"
                              />
                              Đăng nhập với Google
                            </v-btn>
                          </div> -->
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.login-pages {
  > .v-row {
    height: 100vh;
  }
  &:deep(.rounded-bl-xl) {
    border-bottom-left-radius: 300px !important;
    background: #a9ca31 !important;
  }
  &:deep(.rounded-br-xl) {
    border-bottom-right-radius: 300px !important;
    background: #a9ca31 !important;
  }
  :deep(.btn) {
    background: #a9ca31 !important;
  }
}
</style>
