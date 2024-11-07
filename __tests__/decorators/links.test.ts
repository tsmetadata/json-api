import Chance from 'chance';
import { Link, linksSymbol } from '../../src/decorators';
import { isValidKey } from '../../src/utils/isValidKey';

import type { LinkObject } from '../../src/types/linkObject';

jest.mock('../../src/utils/isValidKey');
const isValidKeyMocked = jest.mocked(isValidKey);

describe('`Link`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should check if the given key is valid', () => {
    const key = chance.string();

    Link()(undefined, {
      name: key,
      metadata: {},
    } as ClassFieldDecoratorContext<unknown, string | LinkObject | null>);

    expect(isValidKeyMocked).toHaveBeenCalledWith('Link', key);
  });

  describe('when the given key is valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(true);
    });

    it('should append the key under the links symbol in the metadata', () => {
      const key = chance.string();
      const metadata = {};

      Link()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<unknown, string | LinkObject | null>);

      expect(metadata).toEqual({
        [linksSymbol]: [key],
      });
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(false);
    });

    it('should not set any decorator metadata under the links symbol', () => {
      const key = chance.string();
      const metadata = {};

      Link()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<unknown, string | LinkObject | null>);
      expect(metadata).toEqual({});
    });
  });
});
