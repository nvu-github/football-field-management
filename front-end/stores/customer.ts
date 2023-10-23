export interface CustomerFootballPitchRental {
  footballPitchId: number | null;
  rentalDate: Date | null;
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
    rentalDate: null,
    leasingDurationId: null,
    customerAccessoryRentals: [],
    note: "",
  });

  async function createCustomerFootballPitchRental(
    params: CustomerFootballPitchRental
  ) {
    return await $apis.post("football-pitches/customer/rental", {
      ...convertProjectObjToObj(params),
    });
  }


function resetForm() {
  paramFootballPitchRental.value = {
    footballPitchId: null,
    rentalDate: null,
    leasingDurationId: null,
    customerAccessoryRentals: [],
    note: "",
  };
}

  return { paramFootballPitchRental, createCustomerFootballPitchRental, resetForm };
});
