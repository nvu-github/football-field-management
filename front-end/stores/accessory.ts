export interface ParamsAccessoryType {
  id?: number;
  name: string;
}

export interface ParamsFootballPitchImage {
  url: string;
  title: string;
  accessoryId: number;
}

export interface ParamsAccessory {
  id?: number;
  name: string;
  description: string;
  amount: number;
  price: number;
  images: ParamsFootballPitchImage[];
  accessoryTypeId: number;
  accessoryTypeName: string;
}

export const useAccessoryStore = defineStore("accessoryStore", () => {
  const { $apis }: any = useNuxtApp();
  const accessories = ref<ParamsAccessory[]>([]);
  const accessory = ref<ParamsAccessory>();

  function createAccessory(params: ParamsAccessory) {
    delete params.id;
    return $apis.post("accessories", {
      ...convertProjectObjToObj({ ...params, amount: Number(params.amount) }),
    });
  }

  function deleteImage(id: number) {
    return $apis.delete(`accessories/images/${id}`);
  }

  function updateAccessory(params: ParamsAccessory) {
    const { id }: any = params;
    delete params.id;
    return $apis.patch(`accessories/${id}`, {
      ...convertProjectObjToObj(params),
    });
  }

  function deleteAccessory({ id }: { id: string }) {
    return $apis.delete(`accessories/${id}`);
  }

  async function getAccessories() {
    const accessoryList = await $apis.get("accessories");
    accessories.value = accessoryList.data;
  }

  async function getCustomerAccessories() {
    const accessoryList = await $apis.get("accessories/public");
    accessories.value = accessoryList.data;
  }

  async function getAccessory(id: number) {
    const accessorySingle = await $apis.get(`accessories/${id}`);
    accessory.value = accessorySingle.data;
  }

  return {
    accessories,
    accessory,
    createAccessory,
    updateAccessory,
    deleteAccessory,
    getAccessories,
    getAccessory,
    deleteImage,
    getCustomerAccessories,
  };
});

export const useAccessoryTypeStore = defineStore("AccessoryTypeStore", () => {
  const { $apis }: any = useNuxtApp();
  const accessoryTypes = ref<ParamsAccessoryType[]>([]);
  const accessoryType = ref<ParamsAccessoryType>();

  function createAccessoryType(params: ParamsAccessoryType) {
    delete params.id;
    return $apis.post("accessories/types", {
      ...convertProjectObjToObj(params),
    });
  }

  function updateAccessoryType(params: ParamsAccessoryType) {
    const { id }: any = params;
    delete params.id;
    return $apis.patch(`accessories/types/${id}`, {
      ...convertProjectObjToObj(params),
    });
  }

  function deleteAccessoryType({ id }: { id: string }) {
    return $apis.delete(`accessories/types/${id}`);
  }

  async function getAccessoryTypes() {
    const AccessoryTypeList = await $apis.get("accessories/types");
    accessoryTypes.value = AccessoryTypeList.data;
  }

  async function getAccessoryType(id: number) {
    const AccessoryTypeSingle = await $apis.get(`accessories/types/${id}`);
    accessoryType.value = AccessoryTypeSingle.data;
  }
  return {
    accessoryTypes,
    accessoryType,
    createAccessoryType,
    updateAccessoryType,
    deleteAccessoryType,
    getAccessoryTypes,
    getAccessoryType,
  };
});
