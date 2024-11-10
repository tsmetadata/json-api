import { isObject } from './isObject';

export const clean = <T, O extends object = object>(object: O): T => {
  const keys = Object.keys(object) as (keyof O)[];

  if (keys.length === 0) {
    return {} as T;
  }

  return keys.reduce(
    (acc, key) => {
      const value = object[key];

      if (value === undefined) {
        return acc;
      }

      if (isObject(value)) {
        if (Object.keys(value).length === 0) {
          return acc;
        }

        acc[key] = clean(value) as unknown as O[keyof O];

        return acc;
      }

      acc[key] = value;

      return acc;
    },
    {} as Partial<O>,
  ) as T;
};
