import { Chance } from 'chance';
import { Relationship, relationshipsSymbol } from '../../src/decorators';
import { isValidFieldKey } from '../../src/decorators/utils/isValidFieldKey';

jest.mock('../../src/decorators/utils/isValidFieldKey');

const isValidFieldKeyMocked = jest.mocked(isValidFieldKey);

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

    expect(isValidFieldKeyMocked).toHaveBeenCalledWith(
      'Relationship',
      foreignKey,
    );
  });

  it('should check if the given key is valid', () => {
    isValidFieldKeyMocked.mockReturnValueOnce(true);

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

    expect(isValidFieldKeyMocked).toHaveBeenCalledWith('Relationship', key);
  });

  describe('when the given key and foreign key are valid', () => {
    beforeEach(() => {
      isValidFieldKeyMocked.mockReturnValue(true);
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
      isValidFieldKeyMocked.mockReturnValueOnce(true);
      isValidFieldKeyMocked.mockReturnValueOnce(false);
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
      isValidFieldKeyMocked.mockReturnValueOnce(false);
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
