import { Chance } from 'chance';
import { relationshipsSymbol } from '../../src/decorators/relationship';
import { serializeIncludedResourceObjects } from '../../src/serializers/serializeIncludedResourceObjects';
import { serializeResourceObject } from '../../src/serializers/serializeResourceObject';
import { getMetadataBySymbol } from '../../src/serializers/utils/getMetadataBySymbol';

import type { JSONAPIResourceObject } from '../../src/types/resourceObject';

jest.mock('../../src/serializers/utils/getMetadataBySymbol');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);

jest.mock('../../src/serializers/serializeResourceObject');
const serializeResourceObjectMocked = jest.mocked(serializeResourceObject);

describe('`serializeIncludedResourceObjects`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it("should get the class instance's relationship tuples", () => {
    const instance = {};

    serializeIncludedResourceObjects(instance, []);

    expect(getMetadataBySymbolMocked).toHaveBeenCalledTimes(1);
    expect(getMetadataBySymbolMocked).toHaveBeenCalledWith(
      instance,
      relationshipsSymbol,
    );
  });

  it('should return an empty array if no relationship tuples are found', () => {
    getMetadataBySymbolMocked.mockReturnValueOnce(undefined);

    const result = serializeIncludedResourceObjects({}, []);

    expect(result).toEqual([]);
  });

  it('should filter the relationship tuples based on the `include` parameter', () => {
    const instance = {
      foo: {},
      bar: {
        a: chance.string(),
      },
    };

    getMetadataBySymbolMocked.mockReturnValueOnce([
      ['foo', ''],
      ['bar', ''],
    ]);

    serializeIncludedResourceObjects(instance, ['bar']);

    expect(serializeResourceObjectMocked).toHaveBeenCalledTimes(1);
    expect(serializeResourceObjectMocked).toHaveBeenCalledWith(instance.bar);
  });

  it('should return an empty array if the relationship tuple is undefined', () => {
    getMetadataBySymbolMocked.mockReturnValueOnce(undefined);

    const instance = {
      foo: {},
    };

    const result = serializeIncludedResourceObjects(instance, ['foo']);

    expect(result).toEqual([]);
  });

  it('should not serialize null or undefined related class instances', () => {
    const instance = {
      foo: null,
      bar: undefined,
    };

    getMetadataBySymbolMocked.mockReturnValueOnce([
      ['foo', ''],
      ['bar', ''],
    ]);

    const result = serializeIncludedResourceObjects(instance, ['foo', 'bar']);

    expect(serializeResourceObjectMocked).not.toHaveBeenCalled();

    expect(result).toEqual([]);
  });

  it('should throw an error if a related class instance is not an object', () => {
    const key = chance.string();

    const instance = {
      [key]: chance.string(),
    };

    getMetadataBySymbolMocked.mockReturnValueOnce([[key, '']]);

    expect(() => serializeIncludedResourceObjects(instance, [key])).toThrow(
      `Failed to serialize included resource object for ${key} because the value is not an object.`,
    );
  });

  it('should throw an error if an element in a related class instance array is not an object', () => {
    const key = chance.string();

    const instance = {
      [key]: [chance.string()],
    };

    getMetadataBySymbolMocked.mockReturnValueOnce([[key, '']]);

    expect(() => serializeIncludedResourceObjects(instance, [key])).toThrow(
      `Failed to serialize included resource object for ${key} becuase not all elements in the array are objects.`,
    );
  });

  it('should serialize a related class instance', () => {
    const instance = {
      foo: {
        a: chance.string(),
      },
    };

    getMetadataBySymbolMocked.mockReturnValueOnce([['foo', '']]);

    const resourceObject = { a: chance.string() };
    serializeResourceObjectMocked.mockReturnValueOnce(
      resourceObject as unknown as JSONAPIResourceObject,
    );

    const result = serializeIncludedResourceObjects(instance, ['foo']);

    expect(serializeResourceObjectMocked).toHaveBeenCalledTimes(1);
    expect(serializeResourceObjectMocked).toHaveBeenCalledWith(instance.foo);

    expect(result).toEqual([resourceObject]);
  });

  it('should serialize an array of related class instances', () => {
    const instance = {
      foo: [
        {
          a: chance.string(),
        },
        {
          b: chance.string(),
        },
      ],
    };

    getMetadataBySymbolMocked.mockReturnValueOnce([['foo', '']]);

    const resourceObjects = [{ a: chance.string() }, { b: chance.string() }];
    serializeResourceObjectMocked.mockReturnValueOnce(
      resourceObjects[0] as unknown as JSONAPIResourceObject,
    );
    serializeResourceObjectMocked.mockReturnValueOnce(
      resourceObjects[1] as unknown as JSONAPIResourceObject,
    );

    const result = serializeIncludedResourceObjects(instance, ['foo']);

    expect(serializeResourceObjectMocked).toHaveBeenCalledTimes(2);
    expect(serializeResourceObjectMocked).toHaveBeenNthCalledWith(
      1,
      instance.foo[0],
    );
    expect(serializeResourceObjectMocked).toHaveBeenNthCalledWith(
      2,
      instance.foo[1],
    );

    expect(result).toEqual(resourceObjects);
  });
});
