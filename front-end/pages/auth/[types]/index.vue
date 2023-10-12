<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useRoute, useRouter, useCookie } from "nuxt/app";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthStore } from "~/stores";

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
    return true;
  },
  name: (value: string) => {
    if (!value) return "Vui lòng nhập tên khác hàng";
  },
  teamName: (value: string) => {
    if (!value) return "Vui lòng nhập tên khác hàng";
  },
};

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const step = ref(route.params.types);
// const cookie = useCookie("accessToken", {
//   maxAge: 1000 * 60 * 15,
// });
const loginPayloads = ref<Login>({
  email: "",
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
  const { email, password } = loginPayloads.value;
  const userLogin = await authStore.signIn({ email, password });

  let { name, roleId } = userLogin.data;
  name = name ? name : email;
  user.value = { email, name, loggedIn: true };
  localStorage.setItem(
    "userLogin",
    JSON.stringify({ name, email, roleId, loggedIn: true })
  );

  // if (roleId === CUSTOMER_ROLE) {
  //   return router.push("/");
  // }

  // return router.push("/admin");
}

async function loginGoogle() {
  const auth = await authStore.signInGoogle();
  console.log(auth);
  // const { $firebaseAuth } = useNuxtApp();
  // const provider = new GoogleAuthProvider();
  // const result = await signInWithPopup($firebaseAuth, provider);

  // const credential = GoogleAuthProvider.credentialFromResult(result);
  // cookie.value = credential?.idToken;
  // const { displayName, email } = result.user;
  // user.value = { email, username: displayName, loggedIn: true };
  // localStorage.setItem(
  //   "userLogin",
  //   JSON.stringify({ username: displayName, email, loggedIn: true })
  // );
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
                          <v-row>
                            <v-col cols="12" class="mb-5">
                              <NuxtLink to="/auth/login"
                                ><span class="caption blue--text"
                                  >Quên mật khẩu</span
                                ></NuxtLink
                              >
                            </v-col>
                          </v-row>
                          <v-btn
                            color="blue"
                            class="btn"
                            block
                            type="submit"
                            :disabled="!loginPayloads.value"
                            >Đăng nhập</v-btn
                          >
                          <h5 class="text-center grey--text mt-4 mb-3">Or</h5>
                          <div
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
                          </div>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="6" class="blue rounded-bl-xl">
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
                <v-col cols="12" md="6" class="blue rounded-br-xl">
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
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          label="Email*"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          :rules="rules.email"
                        />
                        <v-text-field
                          label="Tên người dùng*"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          :rules="rules.name"
                        />
                        <v-text-field
                          label="Tên đội bóng*"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          :rules="rules.teamName"
                        />
                        <v-text-field
                          label="Mật khẩu*"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          type="password"
                          :rules="rules.password"
                        />
                        <v-text-field
                          label="Nhập lại mật khẩu*"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          type="password"
                          :rules="rules.password"
                        />
                        <v-btn color="blue" class="btn" dark block
                          >Đăng ký</v-btn
                        >
                        <h5 class="text-center grey--text mt-4 mb-3">Hoặc</h5>
                        <div
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
                        </div>
                      </v-col>
                    </v-row>
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
