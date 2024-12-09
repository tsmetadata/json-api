import { attributesSymbol } from '../decorators/attribute';
import { idSymbol } from '../decorators/id';
import { linksSymbol } from '../decorators/link';
import { metaSymbol } from '../decorators/meta';
import { relationshipsSymbol } from '../decorators/relationship';
import { resourceSymbol } from '../decorators/resource';
import { serializeResourceLinkage } from './serializeResourceLinkage';
import { clean } from './utils/clean';
import { collect } from './utils/collect';
import { getMetadataBySymbol } from './utils/getMetadataBySymbol';
import { isObject } from './utils/isObject';

import type {
  JSONAPILinksObject,
  JSONAPIMetaObject,
  JSONAPIRelationshipsObject,
  JSONAPIResourceObject,
  JSONObject,
} from '../types';
import { isRelationshipObject } from './utils/isRelationshipObject';

export const serializeResourceObject = <I extends object>(
  classInstance: I,
): JSONAPIResourceObject => {
  const relationshipTuples =
    getMetadataBySymbol<[keyof I, string][]>(
      classInstance,
      relationshipsSymbol,
    ) ?? [];

  const relationships = relationshipTuples.reduce((acc, [key]) => {
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

    if (isRelationshipObject(relatedClassInstance_s)) {
      return acc;
    }

    acc[key.toString()] = {
      data: serializeResourceLinkage(relatedClassInstance_s),
    };

    return acc;
  }, {} as JSONAPIRelationshipsObject);

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
