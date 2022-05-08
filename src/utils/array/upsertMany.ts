const upsertMany = <T>(
  array: T[] | undefined,
  items: T[],
  equalityFn: (newItem: T, oldArrayItem: T) => boolean
) => {
  if (array === undefined || array === null) return [items];

  let newArray = [...array];

  for (const newItem of items) {
    const indexFound = newArray.findIndex((oldItem) =>
      equalityFn(newItem, oldItem)
    );

    if (~indexFound) {
      // replace
      newArray[indexFound] = newItem;
    } else {
      // push
      newArray = [...newArray, newItem];
    }
  }

  return newArray;
};

export default upsertMany;
