export interface IUser {
  readonly id: number;
  readonly email: string;
  password?: string;
  readonly name?: string;
  readonly role?: string;
}
