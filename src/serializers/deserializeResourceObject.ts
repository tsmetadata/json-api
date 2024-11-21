import '@tsmetadata/polyfill';

import {
  Attribute,
  Id,
  Relationship,
  Resource,
  attributesSymbol,
  idSymbol,
  linksSymbol,
  metaSymbol,
  relationshipsSymbol,
  resourceSymbol,
} from '../decorators';
import type { JSONAPIResourceObject } from '../types';
import type { JSONAPIResourceLinkage } from '../types/resourceLinkage';
import { getMetadataBySymbol } from './utils';

export const deserializeResourceObject = <
  C,
  T extends JSONAPIResourceObject = JSONAPIResourceObject,
>(
  resourceObject: T,
  { prototype }: new () => C,
): C => {
  const classInstance = Object.create(prototype);

  const type = getMetadataBySymbol<string>(classInstance, resourceSymbol);

  if (type !== resourceObject.type) {
    throw new Error(
      `Failed to deserialize resource object because the type ${resourceObject.type} does not match the expected type ${type}.`,
    );
  }

  const id = getMetadataBySymbol<string>(classInstance, idSymbol);

  if (id !== undefined) {
    classInstance[id] = resourceObject.id ?? null;
  }

  if (resourceObject.attributes !== undefined) {
    const attributes = getMetadataBySymbol<string[]>(
      classInstance,
      attributesSymbol,
    );

    if (attributes !== undefined) {
      for (const attribute of attributes) {
        classInstance[attribute] = resourceObject.attributes[attribute] ?? null;
      }
    }
  }

  if (resourceObject.links !== undefined) {
    const links = getMetadataBySymbol<string>(classInstance, linksSymbol);

    if (links !== undefined) {
      for (const link of links) {
        classInstance[link] = resourceObject.links[link] ?? null;
      }
    }
  }

  if (resourceObject.meta !== undefined) {
    const metas = getMetadataBySymbol<string>(classInstance, metaSymbol);

    if (metas !== undefined) {
      for (const meta of metas) {
        classInstance[meta] = resourceObject.meta[meta] ?? null;
      }
    }
  }

  if (resourceObject.relationships !== undefined) {
    const relationshipTuples =
      getMetadataBySymbol<[string, string][]>(
        classInstance,
        relationshipsSymbol,
      ) ?? [];

    for (const [key] of relationshipTuples) {
      const relationship = resourceObject.relationships[key];

      if (relationship !== undefined) {
        const resourceLinkage = relationship.data;

        if (resourceLinkage !== undefined) {
          classInstance[key] = resourceLinkage ?? null;
        }
      }
    }
  }

  return classInstance;
};
