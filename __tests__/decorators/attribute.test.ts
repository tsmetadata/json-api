import { Chance } from 'chance';
import { Attribute, attributesSymbol } from '../../src/decorators';
import { isValidKey } from '../../src/utils/isValidKey';
jest.mock('../../src/utils/isValidKey');

const isValidKeyMocked = jest.mocked(isValidKey);

describe('`Attribute`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should check if the given key is valid', () => {
    const key = chance.string();

    Attribute()(undefined, {
      name: key,
      metadata: {},
    } as ClassFieldDecoratorContext);
    expect(isValidKeyMocked).toHaveBeenCalledWith('Attribute', key);
  });

  describe('when the given key is valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(true);
    });

    it('should append the key under the attributes symbol in the metadata', () => {
      const key = chance.string();
      const metadata = {};

      Attribute()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext);

      expect(metadata).toEqual({
        [attributesSymbol]: [key],
      });
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(false);
    });

    it('should not set any decorator metadata under the attributes symbol', () => {
      const key = chance.string();
      const metadata = {};

      Attribute()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext);

      expect(metadata).toEqual({});
    });
  });
});
