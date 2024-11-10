import { Chance } from 'chance';
import { assertMetadataIsPresent } from '../../../src/serializers/utils/assertMetadataIsPresent';
import { collect } from '../../../src/serializers/utils/collect';
import { getMetadataBySymbol } from '../../../src/serializers/utils/getMetadataBySymbol';

jest.mock('../../../src/serializers/utils/assertMetadataIsPresent');
const assertMetadataIsPresentMocked = jest.mocked(assertMetadataIsPresent);

jest.mock('../../../src/serializers/utils/getMetadataBySymbol');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);

describe('`collect`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should assert metadata is present in the given object', () => {
    const object = {
      a: chance.string(),
    };

    collect(object, Symbol());

    expect(assertMetadataIsPresentMocked).toHaveBeenCalledTimes(1);
    expect(assertMetadataIsPresentMocked).toHaveBeenCalledWith(object);
  });

  it('should get metadata by symbol', () => {
    const symbol = Symbol(chance.string());
    const object = {
      a: chance.string(),
    };

    getMetadataBySymbolMocked.mockReturnValueOnce(symbol);

    collect(object, symbol);

    expect(getMetadataBySymbolMocked).toHaveBeenCalledTimes(1);
    expect(getMetadataBySymbolMocked).toHaveBeenCalledWith(object, symbol);
  });

  describe('when the metadata is an array of keys', () => {
    it('should return an empty object when the array is empty', () => {
      const object = {
        a: chance.string(),
      };

      getMetadataBySymbolMocked.mockReturnValueOnce([]);

      const result = collect(object, Symbol());

      expect(result).toEqual({});
    });

    it('should return an object with the keys and values from the object', () => {
      const key1 = chance.string();
      const key2 = chance.string();
      const value1 = chance.string();
      const value2 = chance.string();

      const object = {
        [key1]: value1,
        [key2]: value2,
      };

      getMetadataBySymbolMocked.mockReturnValueOnce([key1, key2]);

      const result = collect(object, Symbol());

      expect(result).toEqual({
        [key1]: value1,
        [key2]: value2,
      });
    });

    it('should ignore keys that are not present in the object', () => {
      const key1 = chance.string();
      const key2 = chance.string();
      const value1 = chance.string();

      const object = {
        [key1]: value1,
      };

      getMetadataBySymbolMocked.mockReturnValueOnce([key1, key2]);

      const result = collect(object, Symbol());

      expect(result).toEqual({
        [key1]: value1,
      });
    });
  });

  describe('when the metadata is a key', () => {
    it('should return the value from the object', () => {
      const key = chance.string();
      const value = chance.string();

      const object = {
        [key]: value,
      };

      getMetadataBySymbolMocked.mockReturnValueOnce(key);

      const result = collect(object, Symbol());

      expect(result).toBe(value);
    });
  });
});
