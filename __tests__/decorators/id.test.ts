import { Chance } from 'chance';
import { Id, idSymbol } from '../../src/decorators';
import { isValidFieldKey } from '../../src/decorators/utils/isValidFieldKey';

jest.mock('../../src/decorators/utils/isValidFieldKey');
const isValidFieldKeyMocked = jest.mocked(isValidFieldKey);

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

    expect(isValidFieldKeyMocked).toHaveBeenCalledWith('Id', key);
  });

  describe('when the given key is valid', () => {
    beforeEach(() => {
      isValidFieldKeyMocked.mockReturnValue(true);
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

      expect(() =>
        Id()(undefined, {
          name: key,
          metadata,
        } as ClassFieldDecoratorContext),
      ).toThrow(
        `Id() can only be applied once per class. Unable to denote ${key} as an id because ${metadata[idSymbol]} is already an id.`,
      );
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidFieldKeyMocked.mockReturnValue(false);
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
