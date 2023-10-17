export interface CustomerFootballPitchRental {
  footballPitchId: number | null;
  dateRental: Date | null;
  leasingDurationId: number | null;
  customerAccessoryRentals?: CustomerAccessoryRental[];
  note: string;
}

export interface CustomerAccessoryRental {
  customerFootballPitchRentalId: number;
  amount: number;
  accessoriesId: number;
}

export const useCustomerStore = defineStore("customerStore", () => {
  const { $apis }: any = useNuxtApp();
  const paramFootballPitchRental = ref<CustomerFootballPitchRental>({
    footballPitchId: null,
    dateRental: null,
    leasingDurationId: null,
    customerAccessoryRentals: [],
    note: "",
  });

  async function customerFootballPitchRental(
    params: CustomerFootballPitchRental
  ) {
    return await $apis.post("football-pitches/rental", {
      ...convertProjectObjToObj(params),
    });
  }

  return { paramFootballPitchRental, customerFootballPitchRental };
});
