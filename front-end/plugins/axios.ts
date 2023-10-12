import axios from "axios";

const createInstance = (apiUrl: string) => {
  const userLoggedIn = localStorage.getItem("userLogin");
  let token = ""
  if (userLoggedIn) {
    token = JSON.parse(userLoggedIn)?.accessToken
    console.log(token)
  }

  return axios.create({
    baseURL: apiUrl,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
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

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  return {
    provide: {
      apis: createInstance(runtimeConfig.public.API_URL),
    },
  };
});
