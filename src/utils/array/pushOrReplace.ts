const pushOrReplace = <T>(array: T[] | undefined, item: T, idKey: keyof T) => {
  if (array === undefined || array === null) return [item];

  let newArray = [...array];

  const indexFound = newArray.findIndex((a) => a[idKey] === item[idKey]);
  if (~indexFound) {
    // replace
    newArray[indexFound] = item;
  } else {
    // push
    newArray = [...newArray, item];
  }

  return newArray;
};

export default pushOrReplace;
