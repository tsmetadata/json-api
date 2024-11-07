import { Chance } from 'chance';
import { buildSymbol } from '../../src/utils/buildSymbol';

describe('`buildSymbol`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should return a symbol with the given key', () => {
    const key = chance.string();

    const { description } = buildSymbol(key);

    expect(description).toBe(`TSM.jsonapi.${key}`);
  });
});
