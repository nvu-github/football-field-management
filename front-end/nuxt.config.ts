// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/scss/vuetify.override.scss",
    "@/assets/scss/main.scss",
  ],
  modules: ["@pinia/nuxt"],
  pinia: { autoImports: ["defineStore", "storeToRefs", "defineEmits"] },
  imports: {
    dirs: ["stores", "utils"],
  },
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      DATABASE_URL: process.env.DATABASE_URL,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    },
  },
});
