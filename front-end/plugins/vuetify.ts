// plugins/vuetify.js
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@/assets/scss/main.scss";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    directives,
  });

  nuxtApp.vueApp.use(vuetify);
});
