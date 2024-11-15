import { assertMetadataIsPresent } from './assertMetadataIsPresent';
import { getMetadataBySymbol } from './getMetadataBySymbol';

export const collect = <T = unknown, O extends object = object>(
  object: O,
  symbol: symbol,
) => {
  assertMetadataIsPresent(object);

  const key_s = getMetadataBySymbol<keyof O | (keyof O)[]>(object, symbol);

  if (key_s === undefined) {
    return;
  }

  if (Array.isArray(key_s)) {
    if (key_s.length === 0) {
      return {} as T;
    }

    return key_s.reduce(
      (acc, key) => {
        const value = object[key];

        if (value === undefined) {
          return acc;
        }

        acc[key] = value;

        return acc;
      },
      {} as Record<keyof O, unknown>,
    ) as T;
  }

  return object[key_s] as T;
};
