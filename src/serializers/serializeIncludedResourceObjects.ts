import { getMetadataBySymbol } from './utils/getMetadataBySymbol';

import { relationshipsSymbol } from '../decorators';
import { serializeResourceObject } from './serializeResourceObject';
import { isObject } from './utils/isObject';

import type { JSONAPIResourceObject } from '../types';

export const serializeIncludedResourceObjects = <I extends object>(
  classInstance: I,
  include: (keyof I)[],
): JSONAPIResourceObject[] => {
  const relationshipTuples =
    getMetadataBySymbol<[keyof I, string][]>(
      classInstance,
      relationshipsSymbol,
    ) ?? [];

  const included = relationshipTuples
    .filter(([key]) => include.includes(key))
    .reduce((acc, [key]) => {
      const relatedClassInstance_s = classInstance[key];

      if (
        relatedClassInstance_s === null ||
        relatedClassInstance_s === undefined
      ) {
        return acc;
      }

      if (!isObject(relatedClassInstance_s)) {
        throw new Error(
          `Failed to serialize included resource object for ${key.toString()} because the value is not an object.`,
        );
      }

      if (Array.isArray(relatedClassInstance_s)) {
        if (!relatedClassInstance_s.every(isObject)) {
          throw new Error(
            `Failed to serialize included resource object for ${key.toString()} becuase not all elements in the array are objects.`,
          );
        }

        acc.push(
          ...relatedClassInstance_s.map((classInstance) =>
            serializeResourceObject(classInstance),
          ),
        );

        return acc;
      }

      acc.push(serializeResourceObject(relatedClassInstance_s));

      return acc;
    }, [] as JSONAPIResourceObject[]);

  return included;
};
