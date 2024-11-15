import {
  idSymbol,
  linksSymbol,
  metaSymbol,
  resourceSymbol,
} from '../decorators';
import { collect } from './utils/collect';
import { getMetadataBySymbol } from './utils/getMetadataBySymbol';

import type {
  JSONAPILinksObject,
  JSONAPIMetaObject,
  JSONAPIRelationshipObject,
} from '../types';
import { clean } from './utils/clean';

export const serializeRelationshipObject = <I extends object>(
  classInstance: I,
): JSONAPIRelationshipObject => {
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

  return clean({
    data: {
      type,
      id,
    },
    links: collect<JSONAPILinksObject>(classInstance, linksSymbol),
    meta: collect<JSONAPIMetaObject>(classInstance, metaSymbol),
  });
};
