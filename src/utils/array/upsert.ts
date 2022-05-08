const upsert = <T>(
  array: T[] | undefined,
  item: T,
  equalityFn: (oldArrayItem: T) => boolean
) => {
  if (array === undefined || array === null) return [item];

  let newArray = [...array];

  const indexFound = newArray.findIndex(equalityFn);

  if (~indexFound) {
    // replace
    newArray[indexFound] = item;
  } else {
    // push
    newArray = [...newArray, item];
  }

  return newArray;
};

export default upsert;
