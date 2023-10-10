export interface ParamsLeasingDuration {
  startTime: string;
  endTime: string;
}

export interface ParamsFootballPitchType {
  name: string;
}

export interface ParamsFootballPitch {
  name: string;
  description: string;
  status: string;
  images: ParamsFootballPitchImage[];
  typeId: string;
}

export interface ParamsFootballPitchImage {
  url: string;
  title: string;
  footballId: number;
}

export const footballPitchStatuses: any = {
  EMPTY: "Trống",
  NOT_EMPTY: "Đang thuê",
  MAINTENANCE: "Đang bảo trì",
};

export const useFootballPitchStore = defineStore("footBallPitchStore", () => {
  const { $apis }: any = useNuxtApp();
  const footballPitches = ref<ParamsFootballPitch[]>([]);
  const footballPitch = ref<ParamsFootballPitch>();

  function createFootballPitch(params: ParamsFootballPitch) {
    return $apis
      .post("football-pitches", {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  function uploadImages(params: FormData) {
    return $apis
      .post("upload", {
        body: params,
      })
      .json();
  }

  function updateFootballPitch(id: number, params: ParamsFootballPitch) {
    return $apis
      .patch(`football-pitches/${id}`, {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  async function getFootballPitchs() {
    const footballPitchList = await $apis.get("football-pitches").json();
    footballPitches.value = footballPitchList.data;
  }

  async function getFootballPitch(id: number) {
    const footballPitchSingle = await $apis
      .get(`football-pitches/${id}`)
      .json();
    footballPitch.value = footballPitchSingle.data;
  }

  return {
    footballPitches,
    footballPitch,
    createFootballPitch,
    updateFootballPitch,
    uploadImages,
    getFootballPitchs,
    getFootballPitch,
  };
});

export const useLeasingDurationStore = defineStore(
  "leasingDurationStore",
  () => {
    const { $apis }: any = useNuxtApp();
    const leasingDurations = ref<ParamsLeasingDuration[]>([]);
    const leasingDuration = ref<ParamsLeasingDuration>();

    function createLeasingDuration(params: ParamsLeasingDuration) {
      return $apis
        .post("football-pitches/leasing-durations", {
          json: {
            ...convertProjectObjToObj(params),
          },
        })
        .json();
    }

    function updateLeasingDuration(id: number, params: ParamsLeasingDuration) {
      return $apis
        .patch(`football-pitches/leasing-durations/${id}`, {
          json: {
            ...convertProjectObjToObj(params),
          },
        })
        .json();
    }

    async function getLeasingDurations() {
      const leasingDurationList = await $apis
        .get("football-pitches/leasing-durations")
        .json();
      leasingDurations.value = leasingDurationList.data;
    }

    async function getLeasingDuration(id: number) {
      const leasingDurationSingle = await $apis
        .get(`football-pitches/leasing-durations/${id}`)
        .json();
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
      return $apis
        .post("football-pitches/football-pitch-types", {
          json: {
            ...convertProjectObjToObj(params),
          },
        })
        .json();
    }

    function updateFootballPitchType(
      id: number,
      params: ParamsFootballPitchType
    ) {
      return $apis
        .patch(`football-pitches/football-pitch-types/${id}`, {
          json: {
            ...convertProjectObjToObj(params),
          },
        })
        .json();
    }

    async function getFootballPitchTypes() {
      const footballPitchTypeList = await $apis
        .get("football-pitches/football-pitch-types")
        .json();
      footballPitchTypes.value = footballPitchTypeList.data;
    }

    async function getFootballPitchType(id: number) {
      const footballPitchTypeSingle = await $apis
        .get(`football-pitches/football-pitch-types/${id}`)
        .json();
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
