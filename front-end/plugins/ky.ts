import ky from "ky";

const createInstance = (apiUrl: string) => {
  return ky.create({
    prefixUrl: apiUrl,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
    // credentials: "include",
    hooks: {
      beforeRequest: [setTokenHeader],
    },
  });
};

const createdInstanceUpload = (apiUrl: string) => {
  return ky.create({
    prefixUrl: apiUrl,
    headers: {
      "Content-Type": "multipart/form-data;",
    },
    // credentials: "include",
    hooks: {
      beforeRequest: [setTokenHeader],
    },
  });
};

const setTokenHeader = (req: any) => {
  req.headers.set("Authorization", `Bearer `);
};

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  return {
    provide: {
      apis: createInstance(runtimeConfig.public.API_URL),
      apiUploads: createdInstanceUpload(runtimeConfig.public.API_URL),
    },
  };
});
