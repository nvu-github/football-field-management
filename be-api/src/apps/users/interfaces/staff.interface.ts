export interface IStaff {
  readonly id: number
  readonly name: string
  readonly phoneNumber?: string
  readonly dateOfBirth?: Date
  readonly address?: string
  readonly gender?: string
  readonly avatar?: string
}