import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.public.API_KEY,
    authDomain: config.public.AUTH_DOMAIN,
    databaseURL: config.public.DATABASE_URL,
    projectId: config.public.PROJECT_ID,
    storageBucket: config.public.STORAGE_BUCKET,
    messagingSenderId: config.public.MEASUREMENT_ID,
    appId: config.public.APP_ID,
    measurementId: config.public.MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);

  nuxtApp.provide("firebaseApp", app);
  nuxtApp.provide("firebaseAuth", getAuth(app));
});
