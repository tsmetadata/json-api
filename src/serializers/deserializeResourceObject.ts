import { attributesSymbol } from '../decorators/attribute';
import { idSymbol } from '../decorators/id';
import { linksSymbol } from '../decorators/link';
import { metaSymbol } from '../decorators/meta';
import { relationshipsSymbol } from '../decorators/relationship';
import { resourceSymbol } from '../decorators/resource';
import { getMetadataBySymbol } from './utils/getMetadataBySymbol';

import type { JSONAPIResourceObject } from '../types/resourceObject';

export const deserializeResourceObject = <
  C,
  T extends JSONAPIResourceObject = JSONAPIResourceObject,
>(
  resourceObject: T,
  // biome-ignore lint/suspicious/noExplicitAny: `any` is required to support all class constructors.
  { prototype }: new (..._: any[]) => C,
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
    classInstance[id] = resourceObject.id;
  }

  if (resourceObject.attributes !== undefined) {
    const attributes = getMetadataBySymbol<string[]>(
      classInstance,
      attributesSymbol,
    );

    if (attributes !== undefined) {
      for (const attribute of attributes) {
        classInstance[attribute] = resourceObject.attributes[attribute];
      }
    }
  }

  if (resourceObject.links !== undefined) {
    const links = getMetadataBySymbol<string>(classInstance, linksSymbol);

    if (links !== undefined) {
      for (const link of links) {
        classInstance[link] = resourceObject.links[link];
      }
    }
  }

  if (resourceObject.meta !== undefined) {
    const metas = getMetadataBySymbol<string>(classInstance, metaSymbol);

    if (metas !== undefined) {
      for (const meta of metas) {
        classInstance[meta] = resourceObject.meta[meta];
      }
    }
  }

  if (resourceObject.relationships !== undefined) {
    const relationshipTuples = getMetadataBySymbol<[string, string][]>(
      classInstance,
      relationshipsSymbol,
    );

    if (relationshipTuples !== undefined) {
      for (const [key] of relationshipTuples) {
        const relationship = resourceObject.relationships[key];

        if (relationship !== undefined) {
          const resourceLinkage = relationship.data;

          if (resourceLinkage !== undefined) {
            classInstance[key] = resourceLinkage;
          }
        }
      }
    }
  }

  return classInstance;
};
