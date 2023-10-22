export interface IAccessory {
  id: number;
  name: string;
  description: string;
  amount: number;
  price: number;
  accessoryTypeId: number;
  accessoryTypeName: string;
  images?: Array<any>;
}
