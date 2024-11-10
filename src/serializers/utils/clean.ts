import { isObject } from './isObject';

export const clean = <O extends object = object>(object: O): O => {
  const keys = Object.keys(object) as (keyof O)[];

  if (keys.length === 0) {
    return {} as O;
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

        const child = clean(value);

        if (Object.keys(child).length === 0) {
          return acc;
        }

        acc[key] = child;

        return acc;
      }

      acc[key] = value;

      return acc;
    },
    {} as Partial<O>,
  ) as O;
};
