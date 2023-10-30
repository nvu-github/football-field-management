export interface ParamsLeasingDuration {
  startTime: string;
  endTime: string;
}

export interface ParamsFootballPitchType {
  name: string;
}

export interface ParamsFootballPitchPrice {
  footballPitchId: number;
  leasingDurationId: number;
  price: number;
}

export interface ParamsFootballPitch {
  name: string;
  description: string;
  status: string;
  images: ParamsFootballPitchImage[];
  footballTypeId: string;
  typeName: string;
}

export interface ParamsFootballPitchImage {
  url: string;
  title: string;
  footballId: number;
}

export interface FootballPitchPrice {
  id: number;
  leasingDurationId: number;
  footballPitchId: number;
  footballPitchName: string;
  leasingDurationName: string;
  price: number;
}

export interface FootballPitchRentalInfo {
  id: number;
  name: string;
  note: string;
  description: string;
  status: string;
  price: string;
  startTime: string;
  endTime: string;
  images: Array<{
    id: number;
    url: string;
  }>;
}

export interface FootballPitchRental {
  id: number;
  footballPitchLeasingDurationId: number;
  customerId: number;
  note: string;
  rentalDate: Date;
  customerName: string;
  startTime: string;
  endTime: string;
  footballPitchName: string;
  price: number;
}

export interface AdminConfirmCustomerRental {
  id: number;
  name: string;
  footballPitchName: string;
  status: string;
  rentalDate: string;
  price: string;
  startTime: string;
  endTime: string;
}

export const footballPitchStatuses: any = [
  {
    key: "ACTIVE",
    name: "Hoạt động",
  },
  {
    key: "MAINTENANCE",
    name: "Bảo trì",
  },
];

export const useFootballPitchStore = defineStore("footBallPitchStore", () => {
  const { $apis }: any = useNuxtApp();
  const footballPitches = ref<ParamsFootballPitch[]>([]);
  const footballPitch = ref<ParamsFootballPitch>();
  const footballPitchRentalInfo = ref<FootballPitchRentalInfo[]>([]);
  const footballPitchRental = ref<FootballPitchRentalInfo[]>([]);
  const adminConfirmCustomerRental = ref<AdminConfirmCustomerRental[]>([]);

  function createFootballPitch(params: ParamsFootballPitch) {
    return $apis.post("football-pitches", {
      ...convertProjectObjToObj(params),
    });
  }

  function deleteImage(id: number) {
    return $apis.delete(`football-pitches/images/${id}`);
  }

  function updateFootballPitch(id: number, params: ParamsFootballPitch) {
    return $apis.patch(`football-pitches/${id}`, {
      ...convertProjectObjToObj(params),
    });
  }

  function updateStatusFootballPitchRental({ id, status }: { id: number, status: string }) {
    return $apis.patch(`football-pitches/rental/${id}/status`, { status })
  }

  function deleteFootballPitch({ id }: { id: number }) {
    return $apis.delete(`football-pitches/${id}`);
  }

  async function getFootballPitches() {
    const footballPitchList = await $apis.get("football-pitches");
    footballPitches.value = footballPitchList.data;
  }

  async function getFootballPitch(id: number) {
    const footballPitchSingle = await $apis.get(`football-pitches/${id}`);
    footballPitch.value = footballPitchSingle.data;
  }

  async function getFootballPitchRentalInfo(rentalDate: String) {
    const footballPitchRentalInfoList = await $apis.get(
      `football-pitches/rental/info?rentalDate=${rentalDate}`
    );
    footballPitchRentalInfo.value = footballPitchRentalInfoList.data;
  }

  function getStatusFootballPitch(statusValue: string) {
    return footballPitchStatuses.find(
      (status: any) => status.key == statusValue
    )?.name;
  }

  async function getFootballPitchRental() {
    const footballPitchRentalList = await $apis.get(`football-pitches/rental`);
    footballPitchRental.value = footballPitchRentalList.data;
  }

  async function getAdminConfirmCustomerRental() {
    const adminConfirmCustomerRentals = await $apis.get(
      `football-pitches/rental/confirm`
    );
    adminConfirmCustomerRental.value = adminConfirmCustomerRentals.data;
  }

  return {
    footballPitches,
    footballPitch,
    footballPitchRentalInfo,
    footballPitchRental,
    adminConfirmCustomerRental,
    createFootballPitch,
    updateFootballPitch,
    updateStatusFootballPitchRental,
    getFootballPitches,
    getFootballPitch,
    getStatusFootballPitch,
    deleteImage,
    deleteFootballPitch,
    getFootballPitchRentalInfo,
    getFootballPitchRental,
    getAdminConfirmCustomerRental,
  };
});

export const useLeasingDurationStore = defineStore(
  "leasingDurationStore",
  () => {
    const { $apis }: any = useNuxtApp();
    const leasingDurations = ref<ParamsLeasingDuration[]>([]);
    const leasingDuration = ref<ParamsLeasingDuration>();

    function createLeasingDuration(params: ParamsLeasingDuration) {
      return $apis.post("football-pitches/leasing-durations", {
        ...convertProjectObjToObj(params),
      });
    }

    function updateLeasingDuration(id: number, params: ParamsLeasingDuration) {
      return $apis.patch(`football-pitches/leasing-durations/${id}`, {
        ...convertProjectObjToObj(params),
      });
    }

    function deleteLeasingDuration({id}: {id: number}) {
      return $apis.delete(`football-pitches/leasing-durations/${id}`)
    }

    async function getLeasingDurations() {
      const leasingDurationList = await $apis.get(
        "football-pitches/leasing-durations"
      );
      leasingDurations.value = leasingDurationList.data;
    }

    async function getLeasingDurationPublics() {
      const leasingDurationList = await $apis.get(
        "football-pitches/leasing-durations/public"
      );
      leasingDurations.value = leasingDurationList.data;
    }

    async function getLeasingDuration(id: number) {
      const leasingDurationSingle = await $apis.get(
        `football-pitches/leasing-durations/${id}`
      );
      leasingDuration.value = leasingDurationSingle.data;
    }
    return {
      leasingDurations,
      leasingDuration,
      createLeasingDuration,
      updateLeasingDuration,
      deleteLeasingDuration,
      getLeasingDurations,
      getLeasingDuration,
      getLeasingDurationPublics,
    };
  }
);

export const useFootballPitchTypeStore = defineStore(
  "footballPitchTypeStore",
  () => {
    const { $apis }: any = useNuxtApp();
    const footballPitchTypes = ref<ParamsFootballPitchType[]>([]);
    const footballPitchType = ref<ParamsFootballPitchType>();

    function createFootballPitchType(params: ParamsFootballPitchType) {
      return $apis.post("football-pitches/types", {
        ...convertProjectObjToObj(params),
      });
    }

    function updateFootballPitchType(
      id: number,
      params: ParamsFootballPitchType
    ) {
      return $apis.patch(`football-pitches/types/${id}`, {
        ...convertProjectObjToObj(params),
      });
    }

    function deleteFootballPitchType({id}: {id: number}) {
      return $apis.delete( `football-pitches/types/${id}`)
    }

    async function getFootballPitchTypes() {
      const footballPitchTypeList = await $apis.get("football-pitches/types");
      footballPitchTypes.value = footballPitchTypeList.data;
    }

    async function getFootballPitchType(id: number) {
      const footballPitchTypeSingle = await $apis.get(
        `football-pitches/types/${id}`
      );
      footballPitchType.value = footballPitchTypeSingle.data;
    }
    return {
      footballPitchTypes,
      footballPitchType,
      createFootballPitchType,
      updateFootballPitchType,
      deleteFootballPitchType,
      getFootballPitchTypes,
      getFootballPitchType,
    };
  }
);

export const useFootballPitchPriceStore = defineStore(
  "footballPitchPriceStore",
  () => {
    const { $apis }: any = useNuxtApp();
    const footballPitchPrices = ref<FootballPitchPrice[]>([]);
    const footballPitchPrice = ref<FootballPitchPrice>();

    function createFootballPitchPrice(params: ParamsFootballPitchPrice) {
      return $apis.post("football-pitches/prices", {
        ...convertProjectObjToObj(params),
      });
    }

    function updateFootballPitchPrice(
      id: number,
      params: ParamsFootballPitchPrice
    ) {
      return $apis.patch(`football-pitches/prices/${id}`, {
        ...convertProjectObjToObj(params),
      });
    }

    function deleteFootballPitchPrice({id}: {id: number}) {
      return $apis.delete(`football-pitches/prices/${id}`)
    }

    async function getFootballPitchPrices() {
      const footballPitchPriceList = await $apis.get("football-pitches/prices");
      footballPitchPrices.value = footballPitchPriceList.data;
    }

    async function getFootballPitchPrice(id: number) {
      const footballPitchPriceSingle = await $apis.get(
        `football-pitches/prices/${id}`
      );
      footballPitchPrice.value = footballPitchPriceSingle.data;
    }
    return {
      footballPitchPrices,
      footballPitchPrice,
      createFootballPitchPrice,
      updateFootballPitchPrice,
      deleteFootballPitchPrice,
      getFootballPitchPrices,
      getFootballPitchPrice,
    };
  }
);
