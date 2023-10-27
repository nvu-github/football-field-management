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

export interface CustomerAccessoryRentalHistory {
  id: number;
  name: string;
  footballPitchName: string;
  status: string;
  rentalDate: string;
  price: string;
  startTime: string;
  endTime: string;
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
  const customerFootballPitchRentalHistories = ref<CustomerAccessoryRentalHistory[]>()

  async function createCustomerFootballPitchRental(
    params: CustomerFootballPitchRental
  ) {
    return await $apis.post("football-pitches/customer/rental", {
      ...convertProjectObjToObj(params),
    });
  }

  async function getCustomerFootballPitchRentalHisTories() {
    const customerFootballPitchRentalHistoryList =  await $apis.get("football-pitches/rental/customer/histories")
    customerFootballPitchRentalHistories.value = customerFootballPitchRentalHistoryList.data
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

  return { paramFootballPitchRental, customerFootballPitchRentalHistories, setFootballPitchRentalFromLocalStorage, createCustomerFootballPitchRental, getCustomerFootballPitchRentalHisTories, resetForm };
});
