export const pushOrRemove = <T>(array: T[], item: T, idKey?: keyof T) => {
  if (array === undefined || array === null) return [item];

  let newArray = [...array];

  const indexFound = newArray.findIndex((a) => {
    if (idKey) {
      return a[idKey] === item[idKey];
    }
    return a === item;
  });
  if (~indexFound) {
    // remove
    newArray.splice(indexFound, 1);
  } else {
    // push
    newArray = [...newArray, item];
  }

  return newArray;
};
