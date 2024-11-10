import { assertMetadataIsPresent } from "./assertMetadataIsPresent";
import { getMetadataBySymbol } from "./getMetadataBySymbol";

export const collect = <T = unknown, O extends object = object>(object: O, symbol: symbol) => {
  assertMetadataIsPresent(object);

  const keyOrKeys = getMetadataBySymbol<keyof O | (keyof O)[]>(object, symbol);

  if(Array.isArray(keyOrKeys)) {
    const keys = keyOrKeys;

    if (keys.length === 0) {
      return {} as T;
    }
  
    return keys.reduce((acc, key) => {
      const value = object[key];

      if (value === undefined) {
        return acc;
      }
  
      acc[key] = value;
  
      return acc;
    }, {} as Record<keyof O, unknown>) as T;
  }

  const key = keyOrKeys;

  return object[key] as T;
};