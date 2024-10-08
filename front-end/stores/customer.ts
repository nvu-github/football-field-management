export interface PayloadCustomerFootballPitchRental {
  footballPitchId: number | null;
  rentalDate: String | null | Date;
  leasingDurationId: number | null;
  customerAccessoryRentals?: CustomerAccessoryRental[];
  note?: string;
  rentalPrice?: number | null;
}

export interface CustomerAccessoryRental {
  customerFootballPitchRentalId: number;
  amount: number;
  accessoryId: number;
}

export interface CustomerAccessoryRentalHistory {
  id: number;
  totalPrice: number;
  status: string;
  invoiceFootballPitchRental: any;
}

export const useCustomerStore = defineStore("customerStore", () => {
  const { $apis }: any = useNuxtApp();
  const payloadCustomerFootballPitchRental =
    ref<PayloadCustomerFootballPitchRental>({
      footballPitchId: null,
      rentalDate: null,
      leasingDurationId: null,
      customerAccessoryRentals: [],
      note: "",
    });
  const customerFootballPitchRentalHistories =
    ref<CustomerAccessoryRentalHistory[]>();

  async function createCustomerFootballPitchRental(
    params: PayloadCustomerFootballPitchRental
  ) {
    delete params.rentalPrice;
    return await $apis.post("football-pitches/customer/rental", {
      ...convertProjectObjToObj(params),
    });
  }

  async function getCustomerFootballPitchRentalHisTories() {
    const customerFootballPitchRentalHistoryList = await $apis.get(
      "football-pitches/rental/customer/histories"
    );
    customerFootballPitchRentalHistories.value =
      customerFootballPitchRentalHistoryList.data;
  }

  function setFootballPitchRentalFromLocalStorage() {
    const customerFootballPitchRental = localStorage.getItem(
      "customerFootballPitchRental"
    );
    if (customerFootballPitchRental) {
      payloadCustomerFootballPitchRental.value = JSON.parse(
        customerFootballPitchRental
      );
    }
  }

  function resetForm() {
    payloadCustomerFootballPitchRental.value = {
      footballPitchId: null,
      rentalDate: null,
      leasingDurationId: null,
      customerAccessoryRentals: [],
      note: "",
    };
    localStorage.removeItem("customerFootballPitchRental");
  }

  return {
    payloadCustomerFootballPitchRental,
    customerFootballPitchRentalHistories,
    setFootballPitchRentalFromLocalStorage,
    createCustomerFootballPitchRental,
    getCustomerFootballPitchRentalHisTories,
    resetForm,
  };
});
