import Chance from 'chance';
import { Link, linksSymbol } from '../../src/decorators';
import type { JSONAPILinksObject } from '../../src/types';
import { isValidFieldKey } from '../../src/utils/isValidFieldKey';

jest.mock('../../src/utils/isValidFieldKey');
const isValidFieldKeyMocked = jest.mocked(isValidFieldKey);

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
    } as ClassFieldDecoratorContext<
      unknown,
      JSONAPILinksObject[keyof JSONAPILinksObject]
    >);

    expect(isValidFieldKeyMocked).toHaveBeenCalledWith('Link', key);
  });

  describe('when the given key is valid', () => {
    beforeEach(() => {
      isValidFieldKeyMocked.mockReturnValue(true);
    });

    it('should append the key under the links symbol in the metadata', () => {
      const key = chance.string();
      const metadata = {};

      Link()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<
        unknown,
        JSONAPILinksObject[keyof JSONAPILinksObject]
      >);

      expect(metadata).toEqual({
        [linksSymbol]: [key],
      });
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidFieldKeyMocked.mockReturnValue(false);
    });

    it('should not set any decorator metadata under the links symbol', () => {
      const key = chance.string();
      const metadata = {};

      Link()(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<
        unknown,
        JSONAPILinksObject[keyof JSONAPILinksObject]
      >);
      expect(metadata).toEqual({});
    });
  });
});
