// plugins/vuetify.js
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VAutocomplete } from "vuetify/components";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import '@vuepic/vue-datepicker/dist/main.css'
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
      VAutocomplete,
    },
    defaults: {
      VDataTable: {
        height: "100%",
        fixedHeader: true,
        noDataText: "Không có dữ liệu",
      },
      VAutocomplete: {
        noDataText: "Không có dữ liệu",
      },
    },
    directives,
    theme: {
      defaultTheme: "defaultTheme",
      themes: {
        defaultTheme: {
          dark: false,
          colors: {
            primary: "#174E69",
            "success-darken": "#007F5F",
            error: "#CD2B21",
            "on-primary": "#FFFFFF",
            "primary-light": "#E2EAED",
            warning: "#FCE2AC",
            "in-warning": "#E99E00",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
