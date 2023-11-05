export const convertProjectObjToObj = (obj: Object) => {
  const convertedObj: any = { ...obj };
  delete convertedObj.value;
  return convertedObj;
};

export const convertProxyObjToObj = (obj: any) => {
  const regularObject: any = {};

  for (const key in obj) {
    regularObject[key] = obj[key];
  }

  return regularObject;
};

export const formattedLeasingDuration = (leasingDurationList: any) => {
  return (
    leasingDurationList &&
    leasingDurationList.map((leasingDuration: any) => ({
      ...leasingDuration,
      name: `${leasingDuration.startTime} - ${leasingDuration.endTime}`,
    }))
  );
};

export const removeNullAndEmptyValues = (obj: any) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === "") {
      delete obj[key];
    }
  }
  return obj;
};
