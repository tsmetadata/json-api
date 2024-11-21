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

  return classInstance;
};

@Resource('accounts')
class Account {
  @Id()
  id!: string;

  @Attribute()
  name!: string;

  @Relationship('accounts')
  primaryDebtor!: Customer | JSONAPIResourceLinkage;

  @Relationship('accounts')
  secondaryDebtors!: Customer[] | JSONAPIResourceLinkage;

  @Relationship('accounts')
  yolo!: Customer | JSONAPIResourceLinkage;
}

@Resource('customer')
class Customer {
  @Id()
  id!: string;

  @Relationship('secondaryDebtors')
  @Relationship('primaryDebtor')
  accounts!: Account[] | JSONAPIResourceLinkage;
}

@Resource('yay')
class OtherClass {
  @Id()
  id!: string;

  @Relationship('mc')
  oc!: MyClass[] | JSONAPIResourceLinkage;
}

@Resource('test')
class MyClass {
  @Id()
  id!: string;

  @Attribute()
  name!: string;

  @Relationship('oc')
  mc!: OtherClass | JSONAPIResourceLinkage;
}

const x = deserializeResourceObject(
  {
    type: 'test',
    id: 'hello world',
    attributes: {
      name: 'hello world!!',
    },
    relationships: {
      mc: {
        data: [
          {
            type: 'yay',
            id: 'a',
          },
        ],
      },
    },
    links: {
      self: 'ok',
    },
  } as JSONAPIResourceObject,
  MyClass,
);
console.log(x);

// const x = new MyClass();
// x.id = 'hello';
// x.name = 'yolo';

// const y = new OtherClass();
// y.id = 'a';
// y.oc = x;

// x.mc = y;

// console.log(JSON.stringify(serializeResourceObject(x), null, 2));
