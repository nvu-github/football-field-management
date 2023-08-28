<script lang="ts" setup>
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

definePageMeta({
  layout: "blank",
  middleware: ["auth"],
});

const rules = {
  isRequired: (value: string) => !value || "Field is required",
};

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const step = ref(route.params.types);
const cookie = useCookie("accessToken", {
  maxAge: 1000 * 60 * 15,
});
const loginPayloads = reactive<UserLogin>({
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
  const { email, password } = loginPayloads;
  const userLogin = await authStore.signIn({ email, password });

  const { username } = userLogin;
  user.value = { email, username, loggedIn: true };
  localStorage.setItem(
    "userLogin",
    JSON.stringify({ username, email, loggedIn: true })
  );
}

async function loginGoogle() {
  const { $firebaseAuth } = useNuxtApp();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup($firebaseAuth, provider);

  const credential = GoogleAuthProvider.credentialFromResult(result);
  cookie.value = credential?.idToken;
  const { displayName, email } = result.user;
  user.value = { email, displayName, loggedIn: true };
  localStorage.setItem(
    "userLogin",
    JSON.stringify({ username: displayName, email, loggedIn: true })
  );
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
                    <h1 class="text-center">Login</h1>
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="loginPayloads.email"
                          label="Email"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          class="mt-16"
                          :rules="[rules.isRequired]"
                        />
                        <v-text-field
                          v-model="loginPayloads.password"
                          label="Password"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          type="password"
                        />
                        <v-row>
                          <v-col cols="12" class="mb-5">
                            <NuxtLink to="/auth/login"
                              ><span class="caption blue--text"
                                >Forgot password</span
                              ></NuxtLink
                            >
                          </v-col>
                        </v-row>
                        <v-btn color="blue" dark block tile @click="loginUser"
                          >Log in</v-btn
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
                            Sign with Google
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="6" class="blue rounded-bl-xl">
                  <div style="text-align: center; padding: 180px 0">
                    <v-card-text class="white--text">
                      <h3 class="text-center">Don't Have an Account Yet?</h3>
                      <h6 class="text-center">
                        Let's get you all set up so you can start creating your
                        your first<br />
                        onboarding experience
                      </h6>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="changeRouter"
                        >SIGN UP</v-btn
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
                      <h3 class="text-center">Alredy Signed up?</h3>
                      <h6 class="text-center">
                        Log in to your account so you can continue building
                        and<br />
                        editing your onboarding flows
                      </h6>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="changeRouter"
                        >Log in</v-btn
                      >
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card-text class="mt-12">
                    <h1 class="text-center">Sign Up</h1>
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="8">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="First Name"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                              class="mt-4"
                            />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              label="Last Name"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                              class="mt-4"
                            />
                          </v-col>
                        </v-row>
                        <v-text-field
                          label="Email"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                        />
                        <v-text-field
                          label="Password"
                          outlined
                          dense
                          color="blue"
                          autocomplete="false"
                          type="password"
                        />
                        <v-btn color="blue" dark block tile>Sign up</v-btn>
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
                            Sign with Google
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
    background: #2196f3 !important;
  }
  &:deep(.rounded-br-xl) {
    border-bottom-right-radius: 300px !important;
    background: #2196f3 !important;
  }
}
</style>
