import {
  attributesSymbol,
  idSymbol,
  linksSymbol,
  metaSymbol,
  relationshipsSymbol,
  resourceSymbol,
} from '../decorators';
import { serializeResourceRelationshipObject } from './serializeResourceRelationshipObject';
import { collect } from './utils/collect';
import { getMetadataBySymbol } from './utils/getMetadataBySymbol';
import { isObject } from './utils/isObject';

import type {
  JSONAPILinksObject,
  JSONAPIMetaObject,
  JSONAPIRelationshipObject,
  JSONAPIResourceObject,
  JSONObject,
} from '../types';
import { clean } from './utils/clean';

export const serializeResourceObject = <I extends object>(
  classInstance: I,
): JSONAPIResourceObject => {
  const relationshipTuples =
    getMetadataBySymbol<[keyof I, string][]>(
      classInstance,
      relationshipsSymbol,
    ) ?? [];

  const relationships = relationshipTuples.reduce(
    (acc, [key]) => {
      const relatedClassInstance = classInstance[key];

      if (relatedClassInstance === null || relatedClassInstance === undefined) {
        return acc;
      }

      if (Array.isArray(relatedClassInstance)) {
        if (relatedClassInstance.every(isObject)) {
          acc[key] = relatedClassInstance.map((classInstance) =>
            serializeResourceRelationshipObject(classInstance),
          );

          return acc;
        }

        throw new Error(
          `Failed to serialize resource relationship object for ${key.toString()} becuase not all elements in the array are objects.`,
        );
      }

      if (isObject(relatedClassInstance)) {
        acc[key] = serializeResourceRelationshipObject(relatedClassInstance);

        return acc;
      }

      throw new Error(
        `Failed to serialize resource relationship object for ${key.toString()} because the value is not an object.`,
      );
    },
    {} as Record<
      keyof I,
      JSONAPIRelationshipObject | JSONAPIRelationshipObject[]
    >,
  );

  const type = getMetadataBySymbol<string>(classInstance, resourceSymbol);

  if (type === undefined) {
    throw new Error(
      'Failed to serialize resource object because the provided class instance is not a resource.',
    );
  }

  const id = getMetadataBySymbol<string>(classInstance, idSymbol);

  if (id === undefined) {
    throw new Error(
      'Failed to serialize resource object because the provided class instance does not have an id field.',
    );
  }

  return clean({
    type,
    id,
    attributes: collect<JSONObject>(classInstance, attributesSymbol),
    relationships,
    links: collect<JSONAPILinksObject>(classInstance, linksSymbol),
    meta: collect<JSONAPIMetaObject>(classInstance, metaSymbol),
  });
};
