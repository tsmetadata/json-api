import {
  attributesSymbol,
  idSymbol,
  linksSymbol,
  metaSymbol,
  relationshipsSymbol,
  resourceSymbol,
} from '../decorators';
import { serializeRelationshipObject } from './serializeRelationshipObject';
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
      const relatedClassInstance_s = classInstance[key];

      if (
        relatedClassInstance_s === null ||
        relatedClassInstance_s === undefined
      ) {
        return acc;
      }

      if (!isObject(relatedClassInstance_s)) {
        throw new Error(
          `Failed to serialize relationship object for ${key.toString()} because the value is not an object.`,
        );
      }

      if (Array.isArray(relatedClassInstance_s)) {
        if (!relatedClassInstance_s.every(isObject)) {
          throw new Error(
            `Failed to serialize relationship object for ${key.toString()} becuase not all elements in the array are objects.`,
          );
        }

        acc[key] = relatedClassInstance_s.map((classInstance) =>
          serializeRelationshipObject(classInstance),
        );

        return acc;
      }

      acc[key] = serializeRelationshipObject(relatedClassInstance_s);

      return acc;
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

  const id = collect<string>(classInstance, idSymbol);

  if (id === undefined) {
    throw new Error(
      'Failed to serialize resource object because the provided class instance does not have an id.',
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
