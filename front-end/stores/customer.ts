export interface CustomerFootballPitchRental {
  footballPitchId: number | null;
  rentalDate: String | null | Date;
  leasingDurationId: number | null;
  customerAccessoryRentals?: CustomerAccessoryRental[];
  note?: string;
}

export interface CustomerAccessoryRental {
  customerFootballPitchRentalId: number;
  amount: number;
  accessoryId: number;
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

  function setFootballPitchRentalFromLocalStorage() {
    const customerFootballPitchRental = localStorage.getItem("customerFootballPitchRental");
    if (customerFootballPitchRental) {
      paramFootballPitchRental.value = JSON.parse(customerFootballPitchRental);
    }
  }

  function resetForm() {
    paramFootballPitchRental.value = {
      footballPitchId: null,
      rentalDate: null,
      leasingDurationId: null,
      customerAccessoryRentals: [],
      note: "",
    };
    localStorage.removeItem("customerFootballPitchRental");
  }

  return { paramFootballPitchRental, setFootballPitchRentalFromLocalStorage, createCustomerFootballPitchRental, resetForm };
});
