import { Chance } from 'chance';
import { Meta, metaSymbol } from '../../src/decorators';
import { isValidKey } from '../../src/utils/isValidKey';

import type { ValidDataTypes } from '../../src/types/validDataTypes';

jest.mock('../../src/utils/isValidKey');

const isValidKeyMocked = jest.mocked(isValidKey);

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
    } as ClassFieldDecoratorContext<unknown, ValidDataTypes>);

    expect(isValidKeyMocked).toHaveBeenCalledWith('Meta', key);
  });

  describe('when the given key is valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(true);
    });

    it('should append the key under the meta symbol in the metadata', () => {
      const key = chance.string();
      const metadata = {};

      Meta()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<unknown, ValidDataTypes>);

      expect(metadata).toEqual({
        [metaSymbol]: [key],
      });
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(false);
    });

    it('should not set any decorator metadata under the meta symbol', () => {
      const key = chance.string();
      const metadata = {};

      Meta()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<unknown, ValidDataTypes>);

      expect(metadata).toEqual({});
    });
  });
});
