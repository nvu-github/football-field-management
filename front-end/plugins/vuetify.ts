// plugins/vuetify.js
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VDataTable } from "vuetify/labs/VDataTable";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@/assets/scss/main.scss";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    components: {
      ...components,
      VDataTable,
    },
    defaults: {
      VDataTable: {
        height: "100%",
        fixedHeader: true,
        noDataText: "Không có dữ liệu",
      },
    },
    directives,
  });

  nuxtApp.vueApp.use(vuetify);
});
