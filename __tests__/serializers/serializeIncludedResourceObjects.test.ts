import { relationshipsSymbol } from '../../src/decorators/relationship';
import { serializeIncludedResourceObjects } from '../../src/serializers/serializeIncludedResourceObjects';
import { getMetadataBySymbol } from '../../src/serializers/utils/getMetadataBySymbol';

jest.mock('../../src/serializers/utils/getMetadataBySymbol');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);

import { Chance } from 'chance';
import { serializeResourceObject } from '../../src/serializers/serializeResourceObject';
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
});
