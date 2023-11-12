export interface IFootballPitch {
  id: number;
  name: string;
  description?: string;
  status: string;
  images?: string[];
  footballTypeId?: number;
  footballTypeName: string;
  footballPitchLeasingDuration?: any;
  evaluation?: any;
}
