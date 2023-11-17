import { defineStore } from "pinia";

export const monthItem = [
  {
    label: "Tháng 1",
    value: 1,
  },
  {
    label: "Tháng 2",
    value: 2,
  },
  {
    label: "Tháng 3",
    value: 3,
  },
  {
    label: "Tháng 4",
    value: 4,
  },
  {
    label: "Tháng 5",
    value: 5,
  },
  {
    label: "Tháng 6",
    value: 6,
  },
  {
    label: "Tháng 7",
    value: 7,
  },
  {
    label: "Tháng 8",
    value: 8,
  },
  {
    label: "Tháng 9",
    value: 9,
  },
  {
    label: "Tháng 10",
    value: 10,
  },
  {
    label: "Tháng 11",
    value: 11,
  },
  {
    label: "Tháng 12",
    value: 12,
  },
];

export interface AccessoryReport {
  id: number;
  name: string;
  accessoryType: any;
  totalAmount: number;
  totalPrice: number;
}

export interface EvaluationReport {
  id: number;
  name: string;
  footballType: {
    name: string;
  },
  totalCount: {
    good: number;
    bad: number;
  },
  totalScore: {
    good: number;
    bad: number;
  }, 
  totalScorePercent: {
    good: number;
    bad: number;
  }
}

export const useReportStore = defineStore("reportStore", () => {
  const { $apis }: any = useNuxtApp();
  const accessoriesReport = ref<AccessoryReport[]>([])
  const evaluationReport = ref<EvaluationReport[]>([])

  async function getAccessoryReport(query?: any) {
    const queryParams = {
      month: query ? query.month : "",
      year: query
        ? query.year
        : "",
      rentalDate: query ? query.rentalDate : "",
    };
    const accessoriesReportList = await $apis.get(`reports/accessories`, {
      params: queryParams,
    });
    accessoriesReport.value = accessoriesReportList.data
  }

  async function getEvaluationReport(query?: any) {
    const queryParams = {
      month: query ? query.month : "",
      year: query
        ? query.year
        : "",
      rentalDate: query ? query.rentalDate : "",
    };
    const evaluationReportList = await $apis.get(`reports/evaluations`, {
      params: queryParams,
    });
    evaluationReport.value = evaluationReportList.data
  }

  return { accessoriesReport, evaluationReport, getAccessoryReport, getEvaluationReport };
});
