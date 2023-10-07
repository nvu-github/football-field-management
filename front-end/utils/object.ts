export const convertProjectObjToObj = (obj: Object) => {
  const convertedObj = {...obj}
  delete convertedObj.value
  return convertedObj
}