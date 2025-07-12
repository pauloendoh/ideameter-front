// passes an array of keys, and verifies if they are present in the object.
// should be typed
export function objectHasKeys<T extends object>(
  obj: T,
  keys: (keyof T)[]
): boolean {
  return keys.every((key) => key in obj)
}
