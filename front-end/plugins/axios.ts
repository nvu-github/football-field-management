import axios from "axios";

const createInstance = (apiUrl: string) => {
  return axios.create({
    baseURL: apiUrl,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
  });
};

// const createdInstanceUpload = (apiUrl: string) => {
//   return ky.create({
//     prefixUrl: apiUrl,
//     headers: {
//       "Content-Type": "multipart/form-data;",
//     },
//     // credentials: "include",
//     hooks: {
//       beforeRequest: [setTokenHeader],
//     },
//   });
// };

const setTokenHeader = (token: string) => {
  return `Bearer ${token}`;
};

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  return {
    provide: {
      axios: createInstance(runtimeConfig.public.API_URL),
    },
  };
});
