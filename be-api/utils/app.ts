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

export const mergeAccessoryRental = (arr) => {
  const idMap = {};

  arr.forEach((obj) => {
    const { accessoryId, amount, price, finalCost, invoiceId } = obj;
    if (!idMap[accessoryId]) {
      idMap[accessoryId] = { accessoryId, amount, price, finalCost, invoiceId };
    } else {
      idMap[accessoryId] = {
        accessoryId,
        amount: idMap[accessoryId].amount + amount,
        price: idMap[accessoryId].price,
        finalCost: idMap[accessoryId].finalCost + finalCost,
        invoiceId,
      };
    }
  });
  const mergedArray = Object.values(idMap);

  return mergedArray;
};
