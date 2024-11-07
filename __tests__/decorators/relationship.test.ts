import { Chance } from 'chance';
import { Relationship, relationshipsSymbol } from '../../src/decorators';
import { isValidKey } from '../../src/utils/isValidKey';

import type { ValidDataTypes } from '../../src/types/validDataTypes';

jest.mock('../../src/utils/isValidKey');

const isValidKeyMocked = jest.mocked(isValidKey);

describe('`Relationship`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should check if the given foreign key is valid', () => {
    const key = chance.string();
    const foreignKey = chance.string();

    Relationship(foreignKey)(undefined, {
      name: key,
      metadata: {},
    } as ClassFieldDecoratorContext<
      unknown,
      {
        [key: string]: string;
      }
    >);

    expect(isValidKeyMocked).toHaveBeenCalledWith('Relationship', foreignKey);
  });

  it('should check if the given key is valid', () => {
    isValidKeyMocked.mockReturnValueOnce(true);

    const key = chance.string();
    const foreignKey = chance.string();

    Relationship(foreignKey)(undefined, {
      name: key,
      metadata: {},
    } as ClassFieldDecoratorContext<
      unknown,
      {
        [key: string]: string;
      }
    >);

    expect(isValidKeyMocked).toHaveBeenCalledWith('Relationship', key);
  });

  describe('when the given key and foreign key are valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValue(true);
    });

    it('should append the [key, foreignKey] tuple under the relationships symbol in the metadata', () => {
      const key = chance.string();
      const foreignKey = chance.string();
      const metadata = {};

      Relationship(foreignKey)(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<
        unknown,
        {
          [key: string]: string;
        }
      >);

      expect(metadata).toEqual({
        [relationshipsSymbol]: [[key, foreignKey]],
      });
    });
  });

  describe('when the given key is not valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValueOnce(true);
      isValidKeyMocked.mockReturnValueOnce(false);
    });

    it('should not set any decorator metadata under the relationships symbol', () => {
      const key = chance.string();
      const foreignKey = chance.string();
      const metadata = {};

      Relationship(foreignKey)(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<
        unknown,
        {
          [key: string]: string;
        }
      >);

      expect(metadata).toEqual({});
    });
  });

  describe('when the given foreign key is not valid', () => {
    beforeEach(() => {
      isValidKeyMocked.mockReturnValueOnce(false);
    });

    it('should not set any decorator metadata under the relationships symbol', () => {
      const key = chance.string();
      const foreignKey = chance.string();
      const metadata = {};

      Relationship(foreignKey)(undefined, {
        name: key,
        metadata,
      } as ClassFieldDecoratorContext<
        unknown,
        {
          [key: string]: string;
        }
      >);

      expect(metadata).toEqual({});
    });
  });
});
