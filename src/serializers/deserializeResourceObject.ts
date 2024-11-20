import '@tsmetadata/polyfill';

import {
  Attribute,
  Id,
  Resource,
  attributesSymbol,
  idSymbol,
  linksSymbol,
  metaSymbol,
  relationshipsSymbol,
} from '../decorators';
import type { JSONAPIResourceObject } from '../types';
import { getMetadataBySymbol } from './utils';

export const deserializeResourceObject = <
  C,
  T extends JSONAPIResourceObject = JSONAPIResourceObject,
>(
  resourceObject: T,
  { prototype }: new () => C,
): C => {
  const classInstance = Object.create(prototype);

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
    const relationshipTuples =
      getMetadataBySymbol<[string, string][]>(
        classInstance,
        relationshipsSymbol,
      ) ?? [];

    for (const [key, foreignKey] of relationshipTuples) {
      const relationship = resourceObject.relationships[key];

      if (relationship !== undefined) {
      }
    }
  }

  return classInstance;
};

@Resource('test')
class MyClass {
  @Id()
  id!: string;

  @Attribute()
  name!: string;
}

const x = deserializeResourceObject(
  {
    type: '',
    id: 'hello world',
    attributes: {
      name: 'hello world!!',
    },
  } as JSONAPIResourceObject,
  MyClass,
);
console.log(x);
