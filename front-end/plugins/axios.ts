import axios from "axios";

const createInstance = (apiUrl: string) => {
  const instanceAxios = axios.create({
    baseURL: apiUrl,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
    transformResponse: [
      (data) => {
        try {
          return JSON.parse(data).data;
        } catch (error) {
          console.log(error);
          return data;
        }
      },
    ],
  });

  instanceAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instanceAxios;
};

function getToken() {
  const userLoggedIn = localStorage.getItem("userLogin");
  let token = "";
  if (userLoggedIn) {
    token = JSON.parse(userLoggedIn)?.accessToken;
  }
  return token;
}

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  return {
    provide: {
      apis: createInstance(runtimeConfig.public.API_URL),
    },
  };
});
