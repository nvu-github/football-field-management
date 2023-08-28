import ky from "ky";

const createInstance = (apiUrl: string) => {
  return ky.create({
    prefixUrl: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
    },
  };
});
