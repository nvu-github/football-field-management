export interface ParamsLeasingDuration {
  startTime: string;
  endTime: string;
}

export interface ParamsFootballFieldType {
  name: string;
}

export interface ParamsFootballField {
  name: string;
  description: string;
  status: string;
  images: ParamsFootballFieldImage[];
  typeId: string;
}

export interface ParamsFootballFieldImage {
  url: string;
  title: string;
  footballId: number;
}

export const footballFieldStatuses:any = {
  EMPTY: "Trống",
  NOT_EMPTY: "Đang thuê",
  MAINTENANCE: "Đang bảo trì"
}

export const useFootBallFieldStore = defineStore("footBallFieldStore", () => {
  const { $apis }: any = useNuxtApp();
  const footballFields= ref<ParamsFootballField[]>([])
  const footballField= ref<ParamsFootballField>()

  function createFootballField(params: ParamsFootballField) {
    return $apis
      .post("football-fields", {
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

  function updateFootballField(id: number, params: ParamsFootballField) {
    return $apis
      .patch(`football-fields/${id}`, {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  async function getFootballFields() {
    const footballFieldList = await $apis
      .get("football-fields")
      .json();
      footballFields.value = footballFieldList.data
  }

  async function getFootballField(id: number) {
    const footballFieldSingle = await $apis
      .get(`football-fields/${id}`)
      .json();
      footballField.value = footballFieldSingle.data
  }

  return { footballFields, footballField, createFootballField, updateFootballField, uploadImages, getFootballFields, getFootballField }
})

export const useLeasingDurationStore = defineStore("leasingDurationStore", () => {
  const { $apis }: any = useNuxtApp();
  const leasingDurations = ref<ParamsLeasingDuration[]>([])
  const leasingDuration = ref<ParamsLeasingDuration>()

  function createLeasingDuration(params: ParamsLeasingDuration) {
    return $apis
      .post("football-fields/leasing-durations", {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  function updateLeasingDuration(id: number, params: ParamsLeasingDuration) {
    return $apis
      .patch(`football-fields/leasing-durations/${id}`, {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  async function getLeasingDurations() {
    const leasingDurationList = await $apis
      .get("football-fields/leasing-durations")
      .json();
      leasingDurations.value = leasingDurationList.data
  }

  async function getLeasingDuration(id: number) {
    const leasingDurationSingle = await $apis
      .get(`football-fields/leasing-durations/${id}`)
      .json();
      leasingDuration.value = leasingDurationSingle.data
  }
  return {leasingDurations, leasingDuration, createLeasingDuration, updateLeasingDuration, getLeasingDurations, getLeasingDuration}
})

export const useFootBallFieldTypeStore = defineStore("footBallFieldTypeStore", () => {
  const { $apis }: any = useNuxtApp();
  const footBallFieldTypes = ref<ParamsFootballFieldType[]>([])
  const footBallFieldType = ref<ParamsFootballFieldType>()

  function createFootBallFieldType(params: ParamsFootballFieldType) {
    return $apis
      .post("football-fields/football-field-types", {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  function updateFootBallFieldType(id: number, params: ParamsFootballFieldType) {
    return $apis
      .patch(`football-fields/football-field-types/${id}`, {
        json: {
          ...convertProjectObjToObj(params),
        },
      })
      .json();
  }

  async function getFootBallFieldTypes() {
    const footBallFieldTypeList = await $apis
      .get("football-fields/football-field-types")
      .json();
      footBallFieldTypes.value = footBallFieldTypeList.data
  }

  async function getFootBallFieldType(id: number) {
    const footBallFieldTypeSingle = await $apis
      .get(`football-fields/football-field-types/${id}`)
      .json();
      footBallFieldType.value = footBallFieldTypeSingle.data
  }
  return { footBallFieldTypes, footBallFieldType, createFootBallFieldType, updateFootBallFieldType, getFootBallFieldTypes, getFootBallFieldType }
})