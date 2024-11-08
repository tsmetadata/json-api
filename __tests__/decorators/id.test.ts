import Chance from 'chance';
import { Id, idSymbol } from '../../src/decorators';
import { isValidKey } from '../../src/utils/isValidKey';

jest.mock('../../src/utils/isValidKey');
const isValidKeyMocked = jest.mocked(isValidKey);

describe('`Id`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should check if the given key is valid', () => {
    const key = chance.string();

    Id()(undefined, {
      name: key,
      metadata: {},
    } as ClassFieldDecoratorContext);

    expect(isValidKeyMocked).toHaveBeenCalledWith('Id', key);
  });

  describe('when the given key is valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(true);
    });

    it('should set the key under the id symbol in the metadata', () => {
      const key = chance.string();
      const metadata = {};

      Id()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext);

      expect(metadata).toEqual({
        [idSymbol]: key,
      });
    });

    it('should throw an error if the id symbol is already set in the metadata', () => {
      const key = chance.string();
      const metadata = {
        [idSymbol]: chance.string(),
      };

      try {
        Id()(undefined, {
          name: key,
          metadata,
        } as ClassFieldDecoratorContext);
      } catch (error) {
        expect(error.message).toBe(
          `Id() can only be applied once per class. Unable to denote ${key} as an id because ${metadata[idSymbol]} is already an id.`,
        );
      }
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(false);
    });

    it('should not set any decorator metadata under the id symbol', () => {
      const key = chance.string();
      const metadata = {};

      Id()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext);

      expect(metadata).toEqual({});
    });
  });
});
