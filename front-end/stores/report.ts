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
  totalRented: number;
}

export interface EvaluationReport {
  id: number;
  name: string;
  footballType: {
    name: string;
  };
  totalCount: {
    good: number;
    bad: number;
  };
  totalScore: {
    good: number;
    bad: number;
  };
  totalScorePercent: {
    good: number;
    bad: number;
  };
}

export interface RentalFieldReport {
  id: number;
  name: string;
  footballType: {
    name: string;
  };
  totalRented: number;
  totalCanceled: number;
  totalRevenue: number;
}

export interface RevenueReport {
  month: number;
  totalRevenueFootballPitch: number;
  totalRevenueAccessory: {
    rental: number;
    sell: number;
  };
  totalRevenue: number;
}

export const useReportStore = defineStore("reportStore", () => {
  const { $apis }: any = useNuxtApp();
  const accessoriesReport = ref<AccessoryReport[]>([]);
  const evaluationReport = ref<EvaluationReport[]>([]);
  const rentalFieldReport = ref<RentalFieldReport[]>([]);
  const revenueReport = ref<RevenueReport[]>([]);

  async function getAccessoryReport(query?: any) {
    const queryParams = {
      month: query ? query.month : "",
      year: query ? query.year : "",
      rentalDate: query ? query.rentalDate : "",
    };
    const accessoriesReportList = await $apis.get(`reports/accessories`, {
      params: queryParams,
    });
    accessoriesReport.value = accessoriesReportList.data;
  }

  async function getEvaluationReport(query?: any) {
    const queryParams = {
      month: query ? query.month : "",
      year: query ? query.year : "",
      rentalDate: query ? query.rentalDate : "",
    };
    const evaluationReportList = await $apis.get(`reports/evaluations`, {
      params: queryParams,
    });
    evaluationReport.value = evaluationReportList.data;
  }

  async function getRentalFieldReport(query?: any) {
    const queryParams = {
      month: query ? query.month : "",
      year: query ? query.year : "",
      rentalDate: query ? query.rentalDate : "",
    };
    const rentalFieldReportList = await $apis.get(`reports/rental-fields`, {
      params: queryParams,
    });

    rentalFieldReport.value = rentalFieldReportList.data;
  }

  async function getRevenueReport(query?: any) {
    const queryParams = {
      month: query ? query.month : "",
      year: query ? query.year : "",
      rentalDate: query ? query.rentalDate : "",
    };
    const revenueReportList = await $apis.get(`reports/revenues`, {
      params: queryParams,
    });
    revenueReport.value = revenueReportList.data;
  }

  return {
    accessoriesReport,
    evaluationReport,
    rentalFieldReport,
    revenueReport,
    getAccessoryReport,
    getEvaluationReport,
    getRentalFieldReport,
    getRevenueReport,
  };
});
