export interface ParamsLeasingDuration {
  id?: number;
  startTime: string;
  endTime: string;
}

export interface ParamsFootballPitchType {
  id?: number;
  name: string;
}

export interface ParamsFootballPitchPrice {
  id?: number;
  footballPitchId: number;
  leasingDurationId: number;
  price: number;
}

export interface ParamsFootballPitch {
  id?: number;
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

export interface CustomerFootballPitchRental {
  id: number;
  name: string;
  footballPitchName: string;
  status: string;
  rentalDate: string;
  price: string;
  startTime: string;
  endTime: string;
  customerId: number;
}

export interface CustomerFootballPitchRentalDetail
  extends CustomerFootballPitchRental {
  customer: {
    name: string;
    phoneNumber: string;
  };
  invoice: {
    totalPrice: number;
    moneyPaid: number;
    status: string;
  };
  footballPitchTypeId: number;
  footballPitchTypeName: string;
  leasingDurationName: string;
  footballPitchImages: Array<ParamsFootballPitchImage>;
  accessoryRentals: Array<{
    name: string;
    amount: number;
    price: number;
  }>;
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
  const customerFootballPitchRentals = ref<CustomerFootballPitchRental[]>([]);
  const customerFootballPitchRentalDetail =
    ref<CustomerFootballPitchRentalDetail>();

  function createFootballPitch(params: ParamsFootballPitch) {
    delete params.id;
    return $apis.post("football-pitches", {
      ...convertProjectObjToObj(params),
    });
  }

  function deleteImage(id: number) {
    return $apis.delete(`football-pitches/images/${id}`);
  }

  function updateFootballPitch(params: ParamsFootballPitch) {
    const { id }: any = params;
    delete params.id;
    return $apis.patch(`football-pitches/${id}`, {
      ...convertProjectObjToObj(params),
    });
  }

  function updateStatusFootballPitchRental({
    id,
    status,
  }: {
    id: number;
    status: string;
  }) {
    return $apis.patch(`football-pitches/rental/${id}/status`, { status });
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

  async function getCustomerFootballPitchRentals(query?: any) {
    const queryParams = {
      footballPitchId: query ? query.footballPitchId : "",
      footballPitchLeasingDurationId: query
        ? query.footballPitchLeasingDurationId
        : "",
      rentalDate: query ? query.rentalDate : "",
    };
    const customerFootballPitchRentalList = await $apis.get(
      `football-pitches/rental/confirm`,
      {
        params: queryParams,
      }
    );
    customerFootballPitchRentals.value = customerFootballPitchRentalList.data;
  }

  async function getCustomerFootballPitchRentalDetail(id: number) {
    const customerFootballPitchRentalDetailData = await $apis.get(
      `football-pitches/rental/${id}/detail`
    );
    customerFootballPitchRentalDetail.value =
      customerFootballPitchRentalDetailData.data;
  }

  function getStatusCustomerFootballPitchRental(status: string | any) {
    let color = "success";
    let text = "Xác nhận";
    switch (status) {
      case "REJECT":
        color = "red";
        text = "Hủy";
        break;
      case "PENDING":
        color = "orange";
        text = "Yêu cầu";
        break;
    }
    return { color, text };
  }

  return {
    footballPitches,
    footballPitch,
    footballPitchRentalInfo,
    footballPitchRental,
    customerFootballPitchRentals,
    customerFootballPitchRentalDetail,
    createFootballPitch,
    updateFootballPitch,
    updateStatusFootballPitchRental,
    getFootballPitches,
    getFootballPitch,
    getStatusFootballPitch,
    deleteImage,
    deleteFootballPitch,
    getFootballPitchRentalInfo,
    getCustomerFootballPitchRentals,
    getCustomerFootballPitchRentalDetail,
    getStatusCustomerFootballPitchRental,
  };
});

export const useLeasingDurationStore = defineStore(
  "leasingDurationStore",
  () => {
    const { $apis }: any = useNuxtApp();
    const leasingDurations = ref<ParamsLeasingDuration[]>([]);
    const leasingDuration = ref<ParamsLeasingDuration>();

    function createLeasingDuration(params: ParamsLeasingDuration) {
      delete params.id;
      return $apis.post("football-pitches/leasing-durations", {
        ...convertProjectObjToObj(params),
      });
    }

    function updateLeasingDuration(params: ParamsLeasingDuration) {
      const { id }: any = params;
      delete params.id;
      return $apis.patch(`football-pitches/leasing-durations/${id}`, {
        ...convertProjectObjToObj(params),
      });
    }

    function deleteLeasingDuration({ id }: { id: number }) {
      return $apis.delete(`football-pitches/leasing-durations/${id}`);
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
      delete params.id;
      return $apis.post("football-pitches/types", {
        ...convertProjectObjToObj(params),
      });
    }

    function updateFootballPitchType(params: ParamsFootballPitchType) {
      const { id }: any = params;
      delete params.id;
      return $apis.patch(`football-pitches/types/${id}`, {
        ...convertProjectObjToObj(params),
      });
    }

    function deleteFootballPitchType({ id }: { id: number }) {
      return $apis.delete(`football-pitches/types/${id}`);
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
      delete params.id;
      return $apis.post("football-pitches/prices", {
        ...convertProjectObjToObj(params),
      });
    }

    function updateFootballPitchPrice(params: ParamsFootballPitchPrice) {
      const { id }: any = params;
      delete params.id;
      return $apis.patch(`football-pitches/prices/${id}`, {
        ...convertProjectObjToObj(params),
      });
    }

    function deleteFootballPitchPrice({ id }: { id: number }) {
      return $apis.delete(`football-pitches/prices/${id}`);
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
