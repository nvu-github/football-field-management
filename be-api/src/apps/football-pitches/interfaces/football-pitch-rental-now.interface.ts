export interface IFootballPitchRentalNow {
  id: number;
  name: string;
  description: string;
  status: string;
  images: Array<{
    id: number;
    url: string;
  }>;
  startTime: string;
  endTime: string;
  price: number;
}
