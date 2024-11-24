import { Chance } from 'chance';
import { idSymbol } from '../../../src';
import { resourceSymbol } from '../../../src/decorators/resource';
import { serializeResourceLinkage } from '../../../src/serializers/serializeResourceLinkage';
import { collect } from '../../../src/serializers/utils/collect';
import { getMetadataBySymbol } from '../../../src/serializers/utils/getMetadataBySymbol';

jest.mock('../../../src/serializers/utils/getMetadataBySymbol');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);

jest.mock('../../../src/serializers/utils/collect');
const collectMocked = jest.mocked(collect);

describe('`serializeResourceLinkage`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  describe('when given an array of class instances', () => {
    it('should throw an error if some element in the array is not an object', () => {
      const classInstances = [1];

      expect(() => serializeResourceLinkage(classInstances)).toThrow(
        'Failed to serialize resource linkage because not all elements in the array are objects.',
      );
    });

    it('should throw an error if some element in the array is not a resource', () => {
      const classInstances = [
        {
          a: 'a',
        },
      ];

      getMetadataBySymbolMocked.mockImplementation((_, symbol) => {
        if (symbol === resourceSymbol) {
          return undefined;
        }
      });

      expect(() => serializeResourceLinkage(classInstances)).toThrow(
        'Failed to serialize relationship object because the provided class instance is not a resource.',
      );
    });

    it('should throw an error if some element in the array does not have an id field', () => {
      const classInstances = [
        {
          a: 'a',
        },
      ];

      getMetadataBySymbolMocked.mockImplementation((_, symbol) => {
        if (symbol === resourceSymbol) {
          return 'type';
        }
      });

      collectMocked.mockImplementation(() => undefined);

      expect(() => serializeResourceLinkage(classInstances)).toThrow(
        'Failed to serialize relationship object because the provided class instance does not have an id field.',
      );
    });

    it('should serialize an array of class instances into an array of resource identifier objects', () => {
      const classInstances = [
        {
          someIdField: chance.string(),
          someTypeField: chance.string(),
        },
        {
          someIdField: chance.string(),
          someTypeField: chance.string(),
        },
      ];

      getMetadataBySymbolMocked.mockImplementation((object, symbol) => {
        if (symbol === resourceSymbol) {
          // @ts-expect-error
          return object.someTypeField;
        }
      });

      collectMocked.mockImplementation((object, symbol) => {
        if (symbol === idSymbol) {
          // @ts-expect-error
          return object.someIdField;
        }
      });

      const result = serializeResourceLinkage(classInstances);

      expect(result).toEqual(
        classInstances.map(({ someIdField, someTypeField }) => ({
          type: someTypeField,
          id: someIdField,
        })),
      );
    });
  });

  describe('when given a single class instance', () => {
    it('should throw an error if the class instance is not a resource', () => {
      const classInstance = {
        a: 'a',
      };

      getMetadataBySymbolMocked.mockImplementation((_, symbol) => {
        if (symbol === resourceSymbol) {
          return undefined;
        }
      });

      expect(() => serializeResourceLinkage(classInstance)).toThrow(
        'Failed to serialize relationship object because the provided class instance is not a resource.',
      );
    });

    it('should throw an error if the class instance does not have an id field', () => {
      const classInstance = {
        a: 'a',
      };

      getMetadataBySymbolMocked.mockImplementation((_, symbol) => {
        if (symbol === resourceSymbol) {
          return 'type';
        }
      });

      collectMocked.mockImplementation(() => undefined);

      expect(() => serializeResourceLinkage(classInstance)).toThrow(
        'Failed to serialize relationship object because the provided class instance does not have an id field.',
      );
    });

    it('should serialize a class instance into a resource identifier object', () => {
      const classInstance = {
        someIdField: chance.string(),
        someTypeField: chance.string(),
      };

      getMetadataBySymbolMocked.mockImplementation((object, symbol) => {
        if (symbol === resourceSymbol) {
          // @ts-expect-error
          return object.someTypeField;
        }
      });

      collectMocked.mockImplementation((object, symbol) => {
        if (symbol === idSymbol) {
          // @ts-expect-error
          return object.someIdField;
        }
      });

      const result = serializeResourceLinkage(classInstance);

      expect(result).toEqual({
        type: classInstance.someTypeField,
        id: classInstance.someIdField,
      });
    });
  });
});
