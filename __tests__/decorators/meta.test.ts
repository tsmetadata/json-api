import { Chance } from 'chance';
import { Meta, metaSymbol } from '../../src/decorators';
import { isValidFieldKey } from '../../src/decorators/utils/isValidFieldKey';
import type { JSONDataTypes } from '../../src/types';

jest.mock('../../src/decorators/utils/isValidFieldKey');

const isValidFieldKeyMocked = jest.mocked(isValidFieldKey);

describe('`Meta`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should check if the given key is valid', () => {
    const key = chance.string();

    Meta()(undefined, {
      name: key,
      metadata: {},
    } as ClassFieldDecoratorContext<unknown, JSONDataTypes>);

    expect(isValidFieldKeyMocked).toHaveBeenCalledWith('Meta', key);
  });

  describe('when the given key is valid', () => {
    beforeEach(() => {
      isValidFieldKeyMocked.mockReturnValue(true);
    });

    it('should append the key under the meta symbol in the metadata', () => {
      const key = chance.string();
      const metadata = {};

      Meta()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<unknown, JSONDataTypes>);

      expect(metadata).toEqual({
        [metaSymbol]: [key],
      });
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidFieldKeyMocked.mockReturnValue(false);
    });

    it('should not set any decorator metadata under the meta symbol', () => {
      const key = chance.string();
      const metadata = {};

      Meta()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<unknown, JSONDataTypes>);

      expect(metadata).toEqual({});
    });
  });
});
