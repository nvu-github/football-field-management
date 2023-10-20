export const convertProjectObjToObj = (obj: Object) => {
  const convertedObj = { ...obj };
  delete convertedObj.value;
  return convertedObj;
};

export const convertProxyObjToObj = (obj: any) => {
  const regularObject: any = {};

  for (const key in obj) {
    regularObject[key] = obj[key];
  }

  return regularObject
}

export const formattedLeasingDuration = (leasingDurationList: any) => {
  return (
    leasingDurationList &&
    leasingDurationList.map((leasingDuration: any) => ({
      ...leasingDuration,
      name: `${leasingDuration.startTime} - ${leasingDuration.endTime}`,
    }))
  );
};
