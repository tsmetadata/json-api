import { idSymbol, resourceSymbol } from '../decorators';
import { collect } from './utils/collect';
import { getMetadataBySymbol } from './utils/getMetadataBySymbol';

import type { JSONAPIResourceLinkage } from '../types/resourceLinkage';
import { isObject } from './utils';

export const serializeResourceLinkage = <I extends object>(
  classInstance_s: I,
): Exclude<JSONAPIResourceLinkage, null> => {
  if (Array.isArray(classInstance_s)) {
    if (!classInstance_s.every(isObject)) {
      throw new Error(
        'Failed to serialize resource linkage becuase not all elements in the array are objects.',
      );
    }

    return classInstance_s.map((classInstance) => {
      const type = getMetadataBySymbol<string>(classInstance, resourceSymbol);

      if (type === undefined) {
        throw new Error(
          'Failed to serialize relationship object because the provided class instance is not a resource.',
        );
      }

      const id = collect<string>(classInstance, idSymbol);

      if (id === undefined) {
        throw new Error(
          'Failed to serialize relationship object because the provided class instance does not have an id field.',
        );
      }

      return {
        type,
        id,
      };
    });
  }

  const type = getMetadataBySymbol<string>(classInstance_s, resourceSymbol);

  if (type === undefined) {
    throw new Error(
      'Failed to serialize relationship object because the provided class instance is not a resource.',
    );
  }

  const id = collect<string>(classInstance_s, idSymbol);

  if (id === undefined) {
    throw new Error(
      'Failed to serialize relationship object because the provided class instance does not have an id field.',
    );
  }

  return {
    type,
    id,
  };
};
