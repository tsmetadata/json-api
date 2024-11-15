import { Chance } from 'chance';
import { assertMetadataIsPresent } from '../../../src/serializers/utils/assertMetadataIsPresent';
import { getMetadataBySymbol } from '../../../src/serializers/utils/getMetadataBySymbol';

jest.mock('../../../src/serializers/utils/assertMetadataIsPresent');
const assertMetadataIsPresentMocked = jest.mocked(assertMetadataIsPresent);

describe('`getMetadataSymbol`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should assert metadata is present in the given object', () => {
    const object = {
      constructor: {
        [Symbol.metadata]: {},
      },
    };

    getMetadataBySymbol(object, Symbol('test'));

    expect(assertMetadataIsPresentMocked).toHaveBeenCalledTimes(1);
    expect(assertMetadataIsPresentMocked).toHaveBeenCalledWith(object);
  });

  it("should return the symbol's metadata on the given object", () => {
    const symbol = Symbol(chance.string());

    const object = {
      constructor: {
        [Symbol.metadata]: {
          [symbol]: chance.string(),
        },
      },
    };

    const metadata = getMetadataBySymbol(object, symbol);

    expect(metadata).toBe(object.constructor[Symbol.metadata][symbol]);
  });
});
