import { Chance } from 'chance';
import { attributesSymbol } from '../../src/decorators/attribute';
import { idSymbol } from '../../src/decorators/id';
import { linksSymbol } from '../../src/decorators/link';
import { metaSymbol } from '../../src/decorators/meta';
import { relationshipsSymbol } from '../../src/decorators/relationship';
import { resourceSymbol } from '../../src/decorators/resource';
import { deserializeResourceObject } from '../../src/serializers/deserializeResourceObject';
import { getMetadataBySymbol } from '../../src/serializers/utils/getMetadataBySymbol';

import type { JSONAPIResourceLinkage } from '../../src/types/resourceLinkage';

jest.mock('../../src/serializers/utils/getMetadataBySymbol');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);

describe('`deserializeResourceObject`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  describe('`type`', () => {
    it('should throw an error if the type of the resource object does not match the expected type', () => {
      const expectedType = chance.string();

      getMetadataBySymbolMocked.mockImplementation((_, symbol) => {
        if (symbol === resourceSymbol) {
          return expectedType;
        }
      });

      const resourceObject = {
        type: chance.string(),
        id: chance.string(),
      };

      class SomeResource {}

      expect(() =>
        deserializeResourceObject(resourceObject, SomeResource),
      ).toThrow(
        `Failed to deserialize resource object because the type ${resourceObject.type} does not match the expected type ${expectedType}.`,
      );
    });
  });

  it('should deserialize a resource object into a class instance', () => {
    class SomeResource {
      someIdField!: string;
      someAttributeField!: string;
      someLinkField!: string;
      someMetaField!: string;
      someRelationshipField!: JSONAPIResourceLinkage;
    }

    const classInstance = new SomeResource();
    classInstance.someIdField = chance.string();
    classInstance.someAttributeField = chance.string();
    classInstance.someLinkField = chance.string();
    classInstance.someMetaField = chance.string();

    const type = chance.string();

    getMetadataBySymbolMocked.mockImplementation((_, symbol) => {
      if (symbol === resourceSymbol) {
        return type;
      }

      if (symbol === idSymbol) {
        return 'someIdField';
      }

      if (symbol === attributesSymbol) {
        return ['someAttributeField'];
      }

      if (symbol === linksSymbol) {
        return ['someLinkField'];
      }

      if (symbol === metaSymbol) {
        return ['someMetaField'];
      }

      if (symbol === relationshipsSymbol) {
        return [['someRelationshipField']];
      }
    });

    const resourceObject = {
      type,
      id: classInstance.someIdField,
      attributes: {
        someAttributeField: classInstance.someAttributeField,
      },
      links: {
        someLinkField: classInstance.someLinkField,
      },
      meta: {
        someMetaField: classInstance.someMetaField,
      },
      relationships: {
        someRelationshipField: {
          data: {
            type: chance.string(),
            id: chance.string(),
          },
        },
      },
    };

    const result = deserializeResourceObject(resourceObject, SomeResource);

    expect(result.someIdField).toBe(classInstance.someIdField);
    expect(result.someAttributeField).toBe(classInstance.someAttributeField);
    expect(result.someLinkField).toBe(classInstance.someLinkField);
    expect(result.someMetaField).toBe(classInstance.someMetaField);
    expect(result.someRelationshipField).toBe(
      resourceObject.relationships.someRelationshipField.data,
    );
  });
});
