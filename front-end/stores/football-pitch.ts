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

export interface FootballPitchRental {
  id: number;
  customerId?: number;
  footballPitchLeasingDurationId?: number;
  note: string;
  rentalDate: Date;
  status: string;
  customerName: string;
  footballPitchName: string;
  price: number;
  startTime: string;
  endTime: string;
}

export const footballPitchStatuses: any = [
  {
    key: "EMPTY",
    name: "Trống",
  },
  {
    key: "NOT_EMPTY",
    name: "Đang thuê",
  },
  {
    key: "MAINTENANCE",
    name: "Đang bảo trì",
  },
];

export const useFootballPitchStore = defineStore("footBallPitchStore", () => {
  const { $apis }: any = useNuxtApp();
  const footballPitches = ref<ParamsFootballPitch[]>([]);
  const footballPitch = ref<ParamsFootballPitch>();
  const footballPitchRentals = ref<FootballPitchRental[]>([]);

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

  async function getFootballPitches() {
    const footballPitchList = await $apis.get("football-pitches");
    footballPitches.value = footballPitchList.data;
  }

  async function getFootballPitch(id: number) {
    const footballPitchSingle = await $apis.get(`football-pitches/${id}`);
    footballPitch.value = footballPitchSingle.data;
  }

  async function getFootballPitchRental() {
    const footballPitchRentalList = await $apis.get(`football-pitches/rentals`);
    footballPitchRentals.value = footballPitchRentalList.data;
  }

  function getStatusFootballPitch(statusValue: string) {
    return footballPitchStatuses.find(
      (status: any) => status.key == statusValue
    )?.name;
  }

  return {
    footballPitches,
    footballPitch,
    footballPitchRentals,
    createFootballPitch,
    updateFootballPitch,
    getFootballPitches,
    getFootballPitch,
    getStatusFootballPitch,
    deleteImage,
    getFootballPitchRental,
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

    async function getLeasingDurations() {
      const leasingDurationList = await $apis.get(
        "football-pitches/leasing-durations"
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
      getLeasingDurations,
      getLeasingDuration,
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
      getFootballPitchPrices,
      getFootballPitchPrice,
    };
  }
);
