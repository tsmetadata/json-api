import { idSymbol } from '../decorators/id';
import { resourceSymbol } from '../decorators/resource';
import { collect } from './utils/collect';
import { getMetadataBySymbol } from './utils/getMetadataBySymbol';
import { isObject } from './utils/isObject';
import { isResourceLinkage } from './utils/isResourceLinkage';

import type { JSONAPIResourceLinkage } from '../types/resourceLinkage';

export const serializeResourceLinkage = <I extends object>(
  classInstance_s: I | JSONAPIResourceLinkage,
): JSONAPIResourceLinkage => {
  if (isResourceLinkage(classInstance_s)) {
    return classInstance_s;
  }

  if (Array.isArray(classInstance_s)) {
    if (!classInstance_s.every(isObject)) {
      throw new Error(
        'Failed to serialize resource linkage because not all elements in the array are objects.',
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
          'Failed to serialize relationship object because the provided class instance does not have an id.',
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
      'Failed to serialize relationship object because the provided class instance does not have an id.',
    );
  }

  return {
    type,
    id,
  };
};
