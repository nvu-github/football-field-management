import { EAccountStatus } from '@app/users/enum';
export const getStatusAccount = (accountStatus: string) => {
  let status = EAccountStatus.APPROVED;
  if (accountStatus === 'pending') {
    status = EAccountStatus.PENDING;
  } else if (accountStatus === 'deleted') {
    status = EAccountStatus.DELETED;
  }
  return status;
};

export const sortObject = (obj: object) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};
