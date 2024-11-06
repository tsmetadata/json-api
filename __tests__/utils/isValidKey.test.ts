import { Chance } from 'chance';
import { isValidKey } from '../../src/utils/isValidKey';
import { firstOnlyCharacters, middleOnlyCharacters, reservedCharacters } from '../../src/constants/characterSets';

describe('`isValidKey`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should throw errors that correctly reference the decorator name and key', () => {
    const decoratorName = chance.string();
    const key = chance.integer();

    try {
      isValidKey(decoratorName, key);
    } catch (error) {
      expect(error.message).toContain(
        `@${decoratorName} can only be applied to specific keys. Expected key ${key.toString()}`,
      );
    }
  });

  it('should throw an error if the key is not a string', () => {
    const key = chance.pickone([Symbol(), chance.integer()]);

    try {
      isValidKey('some-decorator', key);
    } catch (error) {
      expect(error.message).toContain(
        `Expected key ${key.toString()} to be of type string, but received ${typeof key}.`,
      );
    }
  });

  it('should throw an error if the key is an empty string', () => {
    const key = '';

    try {
      isValidKey('some-decorator', key);
    } catch (error) {
      expect(error.message).toContain('Expected key to be non-empty.');
    }
  });

  it('should throw an error if the key contains reserved characters', () => {
    const key = chance.pickone([...reservedCharacters]);

    try {
      isValidKey('some-decorator', key);
    }
    catch (error) {
      expect(error.message).toContain(
        `Expected key ${key} to not contain any reserved characters, but found ${key}.`,
      );
    }
  });

  it('should throw an error if the key contains first only characters after the first character', () => {
    const firstOnlyCharacter = chance.pickone([...firstOnlyCharacters]);
    const key = `${chance.guid()}${firstOnlyCharacter}`;

    try {
      isValidKey('some-decorator', key);
    } catch (error) {
      expect(error.message).toContain(
        `Expected key ${key} to not contain the characters ${firstOnlyCharacter}, except as the first character.`,
      );
    }
  });

  it('should allow first only characters as the first character', () => {
    const firstOnlyCharacter = chance.pickone([...firstOnlyCharacters]);
    const key = `${firstOnlyCharacter}${chance.guid()}`;

    expect(isValidKey('some-decorator', key)).toBe(true);
  });

  it('should throw an error if the key contains middle only characters as the first or last character', () => {
    const middleOnlyCharacter = chance.pickone([...middleOnlyCharacters]);
    const key = `${middleOnlyCharacter}${chance.guid()}${middleOnlyCharacter}`;

    try {
      isValidKey('some-decorator', key);
    } catch (error) {
      expect(error.message).toContain(
        `Expected key ${key} to not contain the characters ${middleOnlyCharacter}, ${middleOnlyCharacter} as the first or last character.`,
      );
    }
  });

  it('should allow middle only characters in the middle of the key', () => {
    const middleOnlyCharacter = chance.pickone([...middleOnlyCharacters]);
    const key = `${chance.guid()}${middleOnlyCharacter}${chance.guid()}`;

    expect(isValidKey('some-decorator', key)).toBe(true);
  });

  it('should return true if the key is valid', () => {
    const key = chance.guid();

    expect(isValidKey('some-decorator', key)).toBe(true);
  });
});
