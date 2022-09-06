const deleteFromArray = <T>(
  array: T[] | undefined,

  equalityFn: (deleteItem: T) => boolean
) => {
  if (array === undefined || array === null) return [];

  let newArray = [...array];

  const indexFound = newArray.findIndex(equalityFn);

  if (~indexFound) {
    // replace
    newArray.splice(indexFound, 1);
  }

  return newArray;
};

export default deleteFromArray;
