export interface IFootballPitchRental {
  id: number;
  customerId?: number;
  footballPitchLeasingDurationId?: number;
  note: string;
  rentalDate: Date;
  status: string;
  customerName: string;
  footballPitchId: number;
  footballPitchName: string;
  price: number;
  startTime: string;
  endTime: string;
}
