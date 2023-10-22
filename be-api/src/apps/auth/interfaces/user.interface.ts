export interface IUser {
  readonly id: number;
  readonly email: string;
  password?: string;
  readonly name?: string;
  readonly role?: string;
  readonly roleId?: number;
  readonly roleName?: string;
  readonly customerId?: number;
}
