import { EAccountStatus } from "@app/users/enum"
export const getStatusAccount = (accountStatus: string) => {
  let status = EAccountStatus.APPROVED
  if (accountStatus === 'pending') {
    status = EAccountStatus.PENDING
  } else if (accountStatus === 'deleted') {
    status = EAccountStatus.DELETED
  } 
  return status
}